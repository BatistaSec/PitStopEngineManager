package com.pitstopengine.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pitstopengine.core.dto.AuthRequestDTO;
import com.pitstopengine.core.dto.RegisterRequestDTO;
import com.pitstopengine.core.dto.TeamDTO;
import com.pitstopengine.core.model.Role;
import com.pitstopengine.core.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve registrar novo usuário ADMIN e autenticar obtendo Token JWT")
    void testRegisterAndLogin() throws Exception {
        RegisterRequestDTO registerDTO = RegisterRequestDTO.builder()
                .username("admin_f1")
                .email("admin@pitstopengine.com")
                .password("supersecret123")
                .role(Role.ROLE_ADMIN)
                .build();

        // 1. Registrar
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isCreated());

        // 2. Login
        AuthRequestDTO loginDTO = AuthRequestDTO.builder()
                .username("admin_f1")
                .password("supersecret123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        assertThat(responseBody).contains("accessToken");
        assertThat(responseBody).contains("ROLE_ADMIN");
    }

    @Test
    @DisplayName("Deve negar acesso POST sem Token e permitir POST com Token JWT válido")
    void testProtectedEndpoints() throws Exception {
        // 1. Tentar criar equipe sem token -> 403 Forbidden
        TeamDTO teamDTO = TeamDTO.builder()
                .name("Mercedes AMG F1")
                .country("Germany")
                .baseLocation("Brackley")
                .powerUnit("Mercedes")
                .build();

        mockMvc.perform(post("/api/v1/teams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(teamDTO)))
                .andExpect(status().isForbidden());

        // 2. Registrar ADMIN e obter token
        RegisterRequestDTO registerDTO = RegisterRequestDTO.builder()
                .username("team_principal")
                .email("toto@mercedes.com")
                .password("toto12345")
                .role(Role.ROLE_ADMIN)
                .build();

        MvcResult regResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isCreated())
                .andReturn();

        String token = objectMapper.readTree(regResult.getResponse().getContentAsString()).get("accessToken").asText();

        // 3. Criar equipe COM Token JWT Bearer -> 201 Created
        mockMvc.perform(post("/api/v1/teams")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(teamDTO)))
                .andExpect(status().isCreated());

        // 4. GET público -> 200 OK sem token
        mockMvc.perform(get("/api/v1/teams"))
                .andExpect(status().isOk());
    }
}
