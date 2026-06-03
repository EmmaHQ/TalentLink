package com.talentlink.talentlink.order.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.talentlink.talentlink.order.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrderRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "orders";

    // 💾 Guardar orden (crear o actualizar)
    public Order save(Order order) throws Exception {
        DocumentReference docRef = firestore.collection(COLLECTION).document(order.getId());
        docRef.set(order).get();
        return order;
    }

    // 🔍 Buscar por ID
    public Order findById(String orderId) throws Exception {
        DocumentSnapshot doc = firestore.collection(COLLECTION)
                .document(orderId)
                .get().get();

        if (!doc.exists()) return null;
        return doc.toObject(Order.class);
    }

    // 🔍 Órdenes donde soy el comprador
    public List<Order> findByBuyerId(String buyerId) throws Exception {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION)
                .whereEqualTo("buyerId", buyerId)
                .get();

        return future.get().getDocuments().stream()
                .map(d -> d.toObject(Order.class))
                .toList();
    }

    // 🔍 Órdenes donde soy el vendedor
    public List<Order> findBySellerId(String sellerId) throws Exception {
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION)
                .whereEqualTo("sellerId", sellerId)
                .get();

        return future.get().getDocuments().stream()
                .map(d -> d.toObject(Order.class))
                .toList();
    }
}