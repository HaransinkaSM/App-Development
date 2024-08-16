package com.example.userbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.userbackend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
