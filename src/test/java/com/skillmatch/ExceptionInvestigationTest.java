package com.skillmatch;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;

@SpringBootTest
@AutoConfigureMockMvc
public class ExceptionInvestigationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testMissingFileException() throws Exception {
        Exception ex = mockMvc.perform(multipart("/api/v1/resumes")
                .param("title", "My Resume"))
                .andReturn().getResolvedException();
        System.out.println("MISSING FILE EXCEPTION: " + (ex != null ? ex.getClass().getName() : "null"));
    }

    @Test
    public void testUnknownRouteException() throws Exception {
        Exception ex = mockMvc.perform(request(HttpMethod.GET, "/api/v1/auth/nonexistent"))
                .andReturn().getResolvedException();
        System.out.println("UNKNOWN ROUTE EXCEPTION: " + (ex != null ? ex.getClass().getName() : "null"));
    }
}
