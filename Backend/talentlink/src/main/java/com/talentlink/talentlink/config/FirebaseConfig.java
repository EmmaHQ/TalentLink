package com.talentlink.talentlink.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() {
        try {

            if (FirebaseApp.getApps().isEmpty()) {

                String firebaseJson = System.getenv("FIREBASE_PRIVATE_KEY_JSON");

                if (firebaseJson == null || firebaseJson.isEmpty()) {
                    throw new RuntimeException("FIREBASE_PRIVATE_KEY_JSON no está configurada");
                }

                InputStream serviceAccount = new java.io.ByteArrayInputStream(
                        firebaseJson.getBytes(java.nio.charset.StandardCharsets.UTF_8));

                if (serviceAccount == null) {
                    throw new RuntimeException("firebase-key.json no encontrado");
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp app = FirebaseApp.initializeApp(options);
                return app;
            }

            return FirebaseApp.getInstance();

        } catch (Exception e) {
            throw new RuntimeException("Error inicializando Firebase", e);
        }
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        // 🔥 IMPORTANTE: usa SIEMPRE el app inyectado, no getFirestore sin parámetros
        return FirestoreClient.getFirestore(firebaseApp);
    }
}