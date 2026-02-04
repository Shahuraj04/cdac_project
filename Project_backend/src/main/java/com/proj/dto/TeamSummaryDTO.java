package com.proj.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeamSummaryDTO {

    private long totalTeam;
    private long present;
    private long absent;
    private long onLeave;
    private double avgHours;
    private long lateCount;
}

