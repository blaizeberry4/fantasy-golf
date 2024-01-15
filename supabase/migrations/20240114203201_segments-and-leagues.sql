alter table pga_tour_tournaments
    add column segment text null;

create table leagues (
    id integer primary key generated always as identity,
    name text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    created_by text not null references users(id)
);

alter table leagues owner to postgres;
alter table leagues enable row level security;
grant all on table leagues to postgres;
grant all on table leagues to authenticated;

create policy select_leagues on leagues
    for select
    to authenticated
    using (true);

create policy mutate_own_leagues on leagues
    for all to authenticated
    using (created_by = requesting_user_id())
    with check (created_by = requesting_user_id());

create table league_members (
    league_id integer not null references leagues(id),
    user_id text not null references users(id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    created_by text not null references users(id),
    primary key (league_id, user_id)
);

alter table league_members owner to postgres;
alter table league_members enable row level security;
grant all on table league_members to postgres;
grant all on table league_members to authenticated;

create policy select_league_members on league_members
    for select
    to authenticated
    using (true);

create policy mutate_own_league_members on league_members
    for all to authenticated
    using (created_by = requesting_user_id())
    with check (created_by = requesting_user_id());
