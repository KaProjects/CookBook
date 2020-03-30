package org.kaleta.cookbook.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @RequestMapping(value="/home")
    public String index() {
        return "Hello World! from Syno";
    }

}
