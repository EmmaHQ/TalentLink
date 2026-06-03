package com.talentlink.talentlink.order.controller;

import com.talentlink.talentlink.order.entity.Order;
import com.talentlink.talentlink.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ── POST /api/orders — Crear solicitud ────────────────────────
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestHeader("Authorization") String token,
            @RequestParam String sellerId,
            @RequestParam String sellerName,
            @RequestParam String skillId,
            @RequestParam String skillTitle,
            @RequestParam String message,
            @RequestParam double price
    ) throws Exception {
        return ResponseEntity.ok(
                orderService.createOrder(token, sellerId, sellerName, skillId, skillTitle, message, price)
        );
    }

    // ── GET /api/orders/purchases — Mis compras ───────────────────
    @GetMapping("/purchases")
    public ResponseEntity<List<Order>> getMyPurchases(
            @RequestHeader("Authorization") String token
    ) throws Exception {
        return ResponseEntity.ok(orderService.getMyPurchases(token));
    }

    // ── GET /api/orders/sales — Mis ventas ────────────────────────
    @GetMapping("/sales")
    public ResponseEntity<List<Order>> getMySales(
            @RequestHeader("Authorization") String token
    ) throws Exception {
        return ResponseEntity.ok(orderService.getMySales(token));
    }

    // ── PATCH /api/orders/{orderId}/status — Cambiar estado ───────
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable String orderId,
            @RequestParam String status
    ) throws Exception {
        return ResponseEntity.ok(orderService.updateStatus(token, orderId, status));
    }
}