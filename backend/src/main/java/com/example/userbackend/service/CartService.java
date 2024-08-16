package com.example.userbackend.service;

import com.example.userbackend.model.User;
import com.example.userbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CartService {

    @Autowired
    private UserRepository userRepository;

    public void addProductToCart(Long userId, Long productId, Long quantity) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().merge(productId, quantity, Long::sum);
        userRepository.save(user);
    }

    public void removeProductFromCart(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().remove(productId);
        userRepository.save(user);
    }

    public void removeAllProductsFromCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().clear(); // Clear all items in the cart
        userRepository.save(user);
    }

    public void incrementProductQuantity(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().merge(productId, 1L, Long::sum);
        userRepository.save(user);
    }

    public void decrementProductQuantity(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().computeIfPresent(productId, (key, quantity) -> {
            if (quantity > 1) {
                return quantity - 1;
            } else {
                return null; // Remove entry if quantity is 1
            }
        });
        userRepository.save(user);
    }

    public Map<Long, Long> getCartForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCart();
    }
}
