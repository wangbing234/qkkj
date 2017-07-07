package com.qkkj.pay.controller;

import java.util.Date;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/index")
public class TestController 
{
    @GetMapping(value = "/hello")
	String home() 
	{
        return "Hello World!";
    }

	@RequestMapping(value = "/now", method = RequestMethod.GET)
    String hehe() 
    {
        return "现在时间：" + (new Date());
    }
	
}
