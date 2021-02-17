package com.morganizer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.morganizer.model.UserModel;
import com.morganizer.service.LoginService;
import com.morganizer.service.UserSignupService;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	LoginService loginService;
	
	@Autowired
	UserSignupService userSignupService;
	
	
	@PostMapping("/login")
	public void validateUserCredentials(@RequestBody UserModel userDetails) {
		System.out.println(loginService.validateUser(userDetails));
		
	}
	@PostMapping("/register")
	public void registerUser(@RequestBody UserModel userDetails) throws Exception {
		loginService.registerUser(userDetails);
	}
	
	@GetMapping("/role")
	public void fetchRoles(@RequestParam String username) throws Exception {
		userSignupService.fetchUserRole(username);
	}
}
