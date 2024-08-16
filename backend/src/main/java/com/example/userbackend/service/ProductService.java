package com.example.userbackend.service;

import com.example.userbackend.model.Product;
import com.example.userbackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Retrieve a product by its ID
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Save a new or existing product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Delete a product by its ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
