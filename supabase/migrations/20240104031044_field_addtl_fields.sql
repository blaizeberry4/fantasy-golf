alter table pga_tour_tournament_fields_stroke_play
    add column latest_tee_time timestamp null,
    add column latest_odds_to_win text null
;