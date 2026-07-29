package com.realestate.due_diligence.dashboard.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityResponse {

    private String username;

    private String action;

    private String module;

    private String description;

    private LocalDateTime createdAt;
}
