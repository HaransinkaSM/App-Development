package com.example.userbackend.controller;

import com.example.userbackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public void addProductToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam Long quantity) {
        cartService.addProductToCart(userId, productId, quantity);
    }

    @PostMapping("/remove")
    public void removeProductFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.removeProductFromCart(userId, productId);
    }

    @DeleteMapping("/clear")
    public void clearCart(@RequestParam Long userId) {
        cartService.removeAllProductsFromCart(userId);
    }

    @PostMapping("/increment")
    public void incrementProductQuantity(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.incrementProductQuantity(userId, productId);
    }

    @PostMapping("/decrement")
    public void decrementProductQuantity(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.decrementProductQuantity(userId, productId);
    }

    @GetMapping("/items")
    public Map<Long, Long> getCartItemsForUser(@RequestParam Long userId) {
        return cartService.getCartForUser(userId);
    }
}
