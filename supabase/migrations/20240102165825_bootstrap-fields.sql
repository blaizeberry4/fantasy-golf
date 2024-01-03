create table pga_tour_tournament_fields_stroke_play (
    tournament_id text not null references pga_tour_tournaments(id),
    player_id text not null references pga_tour_players(id),
    round_1_score text null,
    round_2_score text null,
    round_3_score text null,
    round_4_score text null,
    current_total_score text null,
    current_position text null,
    current_round integer null,
    current_round_score text null,
    current_thru text null,
    current_round_status text null,
    current_status text null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    primary key (tournament_id, player_id)
);

alter table pga_tour_tournament_picks_stroke_play owner to postgres;
grant all on table pga_tour_tournament_picks_stroke_play to postgres;
grant select on table pga_tour_tournament_picks_stroke_play to authenticated;
