package com.qkkj.pay.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qkkj.pay.domain.entity.BusiOrderEntity;

public interface BusiOrderRepository extends 
							JpaRepository<BusiOrderEntity, String>
{
	
}
