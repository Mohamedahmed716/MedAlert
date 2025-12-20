package com.hospital.medalert.hospital;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class HospitalAdminControllerTest {

    @Test
    public void contextLoads() {
        // This test will pass if the application context loads successfully
        // It helps verify that our new classes don't have major issues
    }
}