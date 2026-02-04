package com.proj.entity;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hr")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Hr {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hr_id")
	private Long hrId;

	@Column(nullable = false)
	private String hr_name;

	@OneToOne(cascade = jakarta.persistence.CascadeType.ALL)
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	@Column(nullable = false)
	private String phone;

	@ManyToOne
	@JoinColumn(name = "deptId", nullable = false)
	private Department department;

}
