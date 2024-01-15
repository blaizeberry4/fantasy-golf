drop view pga_tour_tournament_picks_stroke_play_enriched;

create view pga_tour_tournament_picks_stroke_play_enriched as
select
    users.id as user_id,
    users.email as user_email,
    users.first_name as user_first_name,
    users.last_name as user_last_name,
    users.image_url as user_image_url,
    pga_tour_tournament_picks_stroke_play.tournament_id,
    pga_tour_tournaments.name as tournament_name,
    pga_tour_tournaments.course_name as tournament_course_name,
    pga_tour_tournaments.planned_dates as tournament_dates,
    pga_tour_tournaments.logo as tournament_logo,
    pga_tour_tournaments.season as tournament_season,
    pga_tour_tournaments.segment as tournament_segment,
    pga_tour_tournament_picks_stroke_play.league_id,
    pga_tour_tournament_picks_stroke_play.player_id,
    pga_tour_tournament_picks_stroke_play.pick_index,
    pga_tour_tournament_picks_stroke_play.created_at as pick_created_at,
    pga_tour_tournament_picks_stroke_play.updated_at as pick_updated_at,
    pga_tour_players.first_name as player_first_name,
    pga_tour_players.last_name as player_last_name,
    pga_tour_players.country as player_country,
    pga_tour_players.country_code as player_country_code,
    pga_tour_players.icon_url as player_icon_url
from users
left join pga_tour_tournament_picks_stroke_play on pga_tour_tournament_picks_stroke_play.user_id = users.id
left join pga_tour_players on pga_tour_players.id = pga_tour_tournament_picks_stroke_play.player_id
left join pga_tour_tournaments on pga_tour_tournaments.id = pga_tour_tournament_picks_stroke_play.tournament_id
;
