package com.qkkj.pay.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qkkj.pay.domain.entity.PlatOrderEntity;

public interface PlatOrderRepository extends JpaRepository<PlatOrderEntity, String>{
	
}
