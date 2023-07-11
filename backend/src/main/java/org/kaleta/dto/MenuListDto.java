package org.kaleta.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MenuListDto {

    private final List<String> ingredients = new ArrayList<>();

    private final List<String> categories = new ArrayList<>();

}
