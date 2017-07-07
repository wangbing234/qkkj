package com.qkkj.pay.repo;

import org.springframework.data.repository.CrudRepository;

import com.qkkj.pay.domain.entity.WorkKeyEntity;

public interface WorkKeyRepository extends 
							CrudRepository<WorkKeyEntity, String>
{
	
	/**
	 * 根据日期查询记录
	 * @param day
	 * @return
	 */
	public WorkKeyEntity findByDay(String day);
	
}
