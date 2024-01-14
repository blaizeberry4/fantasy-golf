create table pga_tour_tournament_stroke_play_position_scores (
    position text primary key not null,
    score integer not null
);

create view pga_tour_tournament_stroke_play_field_scoring_features as
    select
        field.tournament_id,
        field.player_id,
        coalesce(position_scores.score, 0) as position_score,
        case 
            when field.current_position = 'CUT' then false
            when field.current_round >= 3 and field.current_position ~ '[0-9]+' then true
            else null
        end as made_cut,
        field.round_1_score = tournament_summary.low_round_1_score AS shot_low_round_1_score,
        field.round_2_score = tournament_summary.low_round_2_score AS shot_low_round_2_score,
        field.round_3_score = tournament_summary.low_round_3_score AS shot_low_round_3_score,
        field.round_4_score = tournament_summary.low_round_4_score AS shot_low_round_4_score
    from pga_tour_tournament_fields_stroke_play field
    left join pga_tour_tournament_stroke_play_position_scores position_scores
        on position_scores.position = field.current_position
    join (
        select
            tournament_id,
            min(round_1_score) as low_round_1_score,
            min(round_2_score) as low_round_2_score,
            min(round_3_score) as low_round_3_score,
            min(round_4_score) as low_round_4_score
        from pga_tour_tournament_fields_stroke_play
        group by tournament_id
    ) tournament_summary
        on tournament_summary.tournament_id = field.tournament_id
;

create view pga_tour_tournament_stroke_play_field_scoring as
    select
        *,
        (
            position_score
            + cut_bonus
            + shot_low_round_1_score_bonus
            + shot_low_round_2_score_bonus
            + shot_low_round_3_score_bonus
            + shot_low_round_4_score_bonus 
        ) as total_score
    from (
        select
            tournament_id,
            player_id,
            position_score,
            made_cut,
            case 
                when made_cut IS TRUE then 3
                when made_cut IS FALSE then -5
                else 0
            end as cut_bonus,
            shot_low_round_1_score,
            case shot_low_round_1_score when true then 3 else 0 end as shot_low_round_1_score_bonus,
            shot_low_round_2_score,
            case shot_low_round_2_score when true then 3 else 0 end as shot_low_round_2_score_bonus,
            shot_low_round_3_score,
            case shot_low_round_3_score when true then 3 else 0 end as shot_low_round_3_score_bonus,
            shot_low_round_4_score,
            case shot_low_round_4_score when true then 3 else 0 end as shot_low_round_4_score_bonus
        from pga_tour_tournament_stroke_play_field_scoring_features
    ) scoring
;

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
    pga_tour_tournament_fields_stroke_play.updated_at,
    pga_tour_tournament_stroke_play_field_scoring.position_score,
    pga_tour_tournament_stroke_play_field_scoring.made_cut as scoring_made_cut,
    pga_tour_tournament_stroke_play_field_scoring.cut_bonus as scoring_cut_bonus,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_1_score as scoring_shot_low_round_1_score,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_1_score_bonus as scoring_shot_low_round_1_score_bonus,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_2_score as scoring_shot_low_round_2_score,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_2_score_bonus as scoring_shot_low_round_2_score_bonus,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_3_score as scoring_shot_low_round_3_score,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_3_score_bonus as scoring_shot_low_round_3_score_bonus,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_4_score as scoring_shot_low_round_4_score,
    pga_tour_tournament_stroke_play_field_scoring.shot_low_round_4_score_bonus as scoring_shot_low_round_4_score_bonus,
    pga_tour_tournament_stroke_play_field_scoring.total_score as scoring_total_score
from pga_tour_tournament_fields_stroke_play
join pga_tour_players on pga_tour_players.id = pga_tour_tournament_fields_stroke_play.player_id
join pga_tour_tournaments on pga_tour_tournaments.id = pga_tour_tournament_fields_stroke_play.tournament_id
join pga_tour_tournament_stroke_play_field_scoring on
    pga_tour_tournament_stroke_play_field_scoring.tournament_id = pga_tour_tournament_fields_stroke_play.tournament_id
    and pga_tour_tournament_stroke_play_field_scoring.player_id = pga_tour_tournament_fields_stroke_play.player_id
;