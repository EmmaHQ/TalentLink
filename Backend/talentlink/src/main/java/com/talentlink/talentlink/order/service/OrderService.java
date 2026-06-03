package com.talentlink.talentlink.order.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.talentlink.talentlink.auth.service.AuthService;
import com.talentlink.talentlink.order.entity.Order;
import com.talentlink.talentlink.order.repository.OrderRepository;
import com.talentlink.talentlink.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final Firestore firestore;
    private final AuthService authService;
    private final OrderRepository orderRepository;

    // ── Crear orden ───────────────────────────────────────────────
    public Order createOrder(String token, String sellerId, String sellerName,
                             String skillId, String skillTitle,
                             String message, double price) throws Exception {

        User buyer = authService.getCurrentUser(token);

        // 🚫 No puedes comprarte a ti mismo
        if (buyer.getId().equals(sellerId)) {
            throw new RuntimeException("No puedes solicitar tu propio servicio");
        }

        // 🚫 Validar que no haya una orden PENDING duplicada
        List<Order> existing = orderRepository.findByBuyerId(buyer.getId());
        boolean duplicate = existing.stream().anyMatch(o ->
                o.getSkillId().equals(skillId) && o.getStatus().equals("PENDING")
        );
        if (duplicate) {
            throw new RuntimeException("Ya tienes una solicitud pendiente para este servicio");
        }

        DocumentReference docRef = firestore.collection("orders").document();

        Order order = Order.builder()
                .id(docRef.getId())
                .buyerId(buyer.getId())
                .buyerName(buyer.getName())
                .sellerId(sellerId)
                .sellerName(sellerName)
                .skillId(skillId)
                .skillTitle(skillTitle)
                .message(message)
                .price(price)
                .status("PENDING")
                .createdAt(LocalDateTime.now().toString())
                .build();

        docRef.set(order).get();
        return order;
    }

    // ── Mis órdenes como comprador ────────────────────────────────
    public List<Order> getMyPurchases(String token) throws Exception {
        User user = authService.getCurrentUser(token);
        return orderRepository.findByBuyerId(user.getId());
    }

    // ── Mis órdenes como vendedor ─────────────────────────────────
    public List<Order> getMySales(String token) throws Exception {
        User user = authService.getCurrentUser(token);
        return orderRepository.findBySellerId(user.getId());
    }

    // ── Cambiar estado (solo el vendedor puede aceptar/rechazar) ──
    public Order updateStatus(String token, String orderId, String newStatus) throws Exception {

        User user = authService.getCurrentUser(token);

        Order order = orderRepository.findById(orderId);
        if (order == null) {
            throw new RuntimeException("Orden no encontrada");
        }

        // Validar permisos según el estado
        boolean isSeller = order.getSellerId().equals(user.getId());
        boolean isBuyer  = order.getBuyerId().equals(user.getId());

        switch (newStatus) {
            case "ACCEPTED", "REJECTED" -> {
                if (!isSeller) throw new RuntimeException("Solo el vendedor puede aceptar o rechazar");
                if (!order.getStatus().equals("PENDING"))
                    throw new RuntimeException("Solo se puede cambiar una orden en estado PENDING");
            }
            case "COMPLETED" -> {
                if (!isBuyer) throw new RuntimeException("Solo el comprador puede marcar como completada");
                if (!order.getStatus().equals("ACCEPTED"))
                    throw new RuntimeException("Solo se puede completar una orden aceptada");
            }
            default -> throw new RuntimeException("Estado no válido: " + newStatus);
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}