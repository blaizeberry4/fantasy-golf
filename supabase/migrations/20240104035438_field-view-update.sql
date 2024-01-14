drop view pga_tour_tournament_fields_stroke_play_enriched;

create view pga_tour_tournament_fields_stroke_play_enriched as
select
    pga_tour_tournament_fields_stroke_play.tournament_id,
    pga_tour_tournaments.name as tournament_name,
    pga_tour_tournaments.course_name as tournament_course_name,
    pga_tour_tournaments.planned_dates as tournament_dates,
    pga_tour_tournaments.logo as tournament_logo,
    pga_tour_tournament_fields_stroke_play.player_id,
    pga_tour_tournament_fields_stroke_play.round_1_score,
    pga_tour_tournament_fields_stroke_play.round_2_score,
    pga_tour_tournament_fields_stroke_play.round_3_score,
    pga_tour_tournament_fields_stroke_play.round_4_score,
    pga_tour_tournament_fields_stroke_play.current_total_score,
    pga_tour_tournament_fields_stroke_play.current_position,
    pga_tour_tournament_fields_stroke_play.current_round,
    pga_tour_tournament_fields_stroke_play.current_round_score,
    pga_tour_tournament_fields_stroke_play.current_thru,
    pga_tour_tournament_fields_stroke_play.current_round_status,
    pga_tour_tournament_fields_stroke_play.current_status,
    pga_tour_tournament_fields_stroke_play.latest_odds_to_win,
    pga_tour_tournament_fields_stroke_play.latest_tee_time,
    pga_tour_players.first_name as player_first_name,
    pga_tour_players.last_name as player_last_name,
    pga_tour_players.country as player_country,
    pga_tour_players.country_code as player_country_code,
    pga_tour_players.icon_url as player_icon_url,
    pga_tour_tournament_fields_stroke_play.created_at,
    pga_tour_tournament_fields_stroke_play.updated_at
from pga_tour_tournament_fields_stroke_play
join pga_tour_players on pga_tour_players.id = pga_tour_tournament_fields_stroke_play.player_id
join pga_tour_tournaments on pga_tour_tournaments.id = pga_tour_tournament_fields_stroke_play.tournament_id
;