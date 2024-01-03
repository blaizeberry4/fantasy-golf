create table pga_tour_tournaments (
    id text primary key,
    name text not null,
    course_name text null,
    start_date timestamp not null,
    logo text null,
    city text not null,
    state text null,
    state_code text null,
    country text null,
    country_code text null,
    planned_start_date date null,
    planned_end_date date null,
    planned_dates text null,
    planned_dates_accessibility text null,
    purse text null,
    status text null,
    season text null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    raw_json jsonb null
);

alter table pga_tour_tournaments owner to postgres;
grant all on table pga_tour_tournaments to postgres;
grant select on table pga_tour_tournaments to authenticated;

create table pga_tour_players (
    id text primary key,
    liv_player_id text null,
    first_name text not null,
    last_name text not null,
    country text null,
    country_code text null,
    icon_url text null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    raw_json jsonb null
);

alter table pga_tour_players owner to postgres;
grant all on table pga_tour_players to postgres;
grant select on table pga_tour_players to authenticated;