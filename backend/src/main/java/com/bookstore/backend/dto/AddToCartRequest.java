package com.bookstore.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {

    @NotNull
    private Integer bookId;

    @NotNull
    @Min(1)
    private Integer quantity;
}