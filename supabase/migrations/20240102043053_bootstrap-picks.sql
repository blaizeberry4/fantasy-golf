create table pga_tour_tournament_picks_stroke_play (
    id text primary key,
    tournament_id text not null references pga_tour_tournaments(id),
    player_id text not null references pga_tour_players(id),
    user_id text not null references users(id),
    pick_index integer not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

alter table pga_tour_tournament_picks_stroke_play owner to postgres;
alter table pga_tour_tournament_picks_stroke_play enable row level security;
grant all on table pga_tour_tournament_picks_stroke_play to postgres;
grant all on table pga_tour_tournament_picks_stroke_play to authenticated;

create policy select_picks on pga_tour_tournament_picks_stroke_play
    for select
    to authenticated
    using (true);
create policy mutate_own_picks on pga_tour_tournament_picks_stroke_play
    for all to authenticated
    using (user_id = requesting_user_id())
    with check (user_id = requesting_user_id());
