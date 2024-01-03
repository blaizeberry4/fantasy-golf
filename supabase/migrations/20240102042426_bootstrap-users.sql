create table users (
    id text primary key,
    email text not null,
    first_name text not null,
    last_name text not null,
    image_url text null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

alter table users owner to postgres;
grant all on table users to postgres;
grant select on table users to authenticated;

-- For deriving clerk user_id
create or replace function requesting_user_id()
returns text
language sql stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;
