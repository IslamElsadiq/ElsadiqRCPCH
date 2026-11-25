-- ElsadiqRCPH schema v1
create extension if not exists pgcrypto;

create type app_role as enum ('student','editor','admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role app_role not null default 'student',
  created_at timestamptz not null default now()
);

create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('editor','admin'));
$$;
create or replace function is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create table tracks   (id serial primary key, slug text unique not null, name text not null);
create table subjects (id serial primary key, track_id int references tracks(id) on delete cascade, name text not null, sort int default 0);
create table systems  (id serial primary key, name text not null unique);
create table topics   (id serial primary key, subject_id int references subjects(id) on delete cascade, system_id int references systems(id), name text not null, code text unique);

create table questions (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  topic_id int references topics(id) on delete set null,
  stem text not null,
  key_point text,
  reference text,
  difficulty smallint check (difficulty between 1 and 5),
  status text not null default 'draft_needs_clinical_review' check (status in ('draft_needs_clinical_review','reviewed','published','retired')),
  created_at timestamptz not null default now()
);
create table options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  label char(1) not null check (label in ('A','B','C','D','E')),
  body text not null,
  unique (question_id, label)
);
-- answer key kept apart so students cannot read it through the API before answering
create table option_keys (
  option_id uuid primary key references options(id) on delete cascade,
  is_correct boolean not null default false,
  explanation text
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  topic_id int references topics(id) on delete set null,
  slug text unique not null,
  title text not null,
  body_md text not null,
  status text not null default 'draft_needs_clinical_review' check (status in ('draft_needs_clinical_review','reviewed','published','retired')),
  created_at timestamptz not null default now()
);
create table article_questions (article_id uuid references articles(id) on delete cascade, question_id uuid references questions(id) on delete cascade, primary key (article_id, question_id));

create table tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  mode text not null check (mode in ('tutor','timed')),
  time_limit_sec int,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create table test_questions (test_id uuid references tests(id) on delete cascade, question_id uuid references questions(id), position int not null, primary key (test_id, question_id));
create table answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  test_id uuid references tests(id) on delete cascade,
  question_id uuid not null references questions(id),
  option_id uuid references options(id),
  is_correct boolean,
  time_ms int,
  flagged boolean default false,
  answered_at timestamptz not null default now()
);
create index answers_user_idx on answers(user_id, question_id);
create table user_topic_stats (user_id uuid references auth.users(id) on delete cascade, topic_id int references topics(id) on delete cascade, attempted int not null default 0, correct int not null default 0, primary key (user_id, topic_id));
create table flashcards (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(), front text not null, back text not null, due_at timestamptz not null default now(), interval_days int not null default 0, ease real not null default 2.5);
create table notes (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(), question_id uuid references questions(id) on delete cascade, body text not null, updated_at timestamptz not null default now());
create table contests (id uuid primary key default gen_random_uuid(), title text not null, starts_at timestamptz not null, ends_at timestamptz not null);
create table question_reports (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null default auth.uid(), question_id uuid not null references questions(id) on delete cascade, reason text not null, created_at timestamptz not null default now(), resolved boolean not null default false);

-- RLS
alter table profiles enable row level security;
alter table tracks enable row level security;
alter table subjects enable row level security;
alter table systems enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table options enable row level security;
alter table option_keys enable row level security;
alter table articles enable row level security;
alter table article_questions enable row level security;
alter table tests enable row level security;
alter table test_questions enable row level security;
alter table answers enable row level security;
alter table user_topic_stats enable row level security;
alter table flashcards enable row level security;
alter table notes enable row level security;
alter table contests enable row level security;
alter table question_reports enable row level security;

create policy profiles_self_read on profiles for select using (id = auth.uid() or is_staff());
create policy profiles_self_update on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
create policy profiles_admin_all on profiles for all using (is_admin()) with check (is_admin());

-- taxonomy: readable by signed-in users, editable by staff
create policy tracks_read on tracks for select to authenticated using (true);
create policy tracks_write on tracks for all using (is_staff()) with check (is_staff());
create policy subjects_read on subjects for select to authenticated using (true);
create policy subjects_write on subjects for all using (is_staff()) with check (is_staff());
create policy systems_read on systems for select to authenticated using (true);
create policy systems_write on systems for all using (is_staff()) with check (is_staff());
create policy topics_read on topics for select to authenticated using (true);
create policy topics_write on topics for all using (is_staff()) with check (is_staff());

-- content: students see published only
create policy questions_read on questions for select to authenticated using (status = 'published' or is_staff());
create policy questions_write on questions for all using (is_staff()) with check (is_staff());
create policy options_read on options for select to authenticated using (is_staff() or exists (select 1 from questions q where q.id = question_id and q.status = 'published'));
create policy option_keys_staff on option_keys for all using (is_staff()) with check (is_staff());
create policy options_write on options for all using (is_staff()) with check (is_staff());
create policy articles_read on articles for select to authenticated using (status = 'published' or is_staff());
create policy articles_write on articles for all using (is_staff()) with check (is_staff());
create policy aq_read on article_questions for select to authenticated using (true);
create policy aq_write on article_questions for all using (is_staff()) with check (is_staff());
create policy contests_read on contests for select to authenticated using (true);
create policy contests_write on contests for all using (is_staff()) with check (is_staff());

-- per-user data
create policy tests_own on tests for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy tq_own on test_questions for all using (exists (select 1 from tests t where t.id = test_id and t.user_id = auth.uid())) with check (exists (select 1 from tests t where t.id = test_id and t.user_id = auth.uid()));
create policy answers_own on answers for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy uts_own on user_topic_stats for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy flashcards_own on flashcards for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notes_own on notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reports_insert on question_reports for insert to authenticated with check (user_id = auth.uid());
create policy reports_staff on question_reports for all using (is_staff()) with check (is_staff());

-- RPC: tutor-mode answer. Returns correctness + explanations only after submit.
create or replace function submit_answer(p_test uuid, p_question uuid, p_option uuid, p_time_ms int default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_correct boolean; v_topic int; v_mode text; v_result jsonb;
begin
  select mode into v_mode from tests where id = p_test and user_id = auth.uid();
  if v_mode is null then raise exception 'test not found'; end if;
  select k.is_correct into v_correct from options o join option_keys k on k.option_id = o.id where o.id = p_option and o.question_id = p_question;
  if v_correct is null then raise exception 'option not found'; end if;
  insert into answers (user_id, test_id, question_id, option_id, is_correct, time_ms) values (auth.uid(), p_test, p_question, p_option, v_correct, p_time_ms);
  select topic_id into v_topic from questions where id = p_question;
  if v_topic is not null then
    insert into user_topic_stats (user_id, topic_id, attempted, correct) values (auth.uid(), v_topic, 1, case when v_correct then 1 else 0 end)
    on conflict (user_id, topic_id) do update set attempted = user_topic_stats.attempted + 1, correct = user_topic_stats.correct + case when v_correct then 1 else 0 end;
  end if;
  if v_mode = 'tutor' then
    select jsonb_build_object('is_correct', v_correct, 'options', jsonb_agg(jsonb_build_object('label', o.label, 'is_correct', k.is_correct, 'explanation', k.explanation) order by o.label))
      into v_result from options o join option_keys k on k.option_id = o.id where o.question_id = p_question;
    return v_result || (select jsonb_build_object('key_point', key_point, 'reference', reference) from questions where id = p_question);
  end if;
  return jsonb_build_object('recorded', true);
end $$;

create or replace function finish_test(p_test uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  update tests set finished_at = now() where id = p_test and user_id = auth.uid();
  select jsonb_build_object('total', count(*), 'correct', count(*) filter (where is_correct)) into r from answers where test_id = p_test and user_id = auth.uid();
  return r;
end $$;

create or replace function create_test(
  p_mode text,
  p_count int default 20,
  p_topic_ids int[] default null,
  p_subject_ids int[] default null,
  p_only_wrong boolean default false,
  p_unseen_only boolean default false,
  p_time_limit_sec int default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_test uuid; v_n int;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_mode not in ('tutor','timed') then raise exception 'bad mode'; end if;
  p_count := least(greatest(coalesce(p_count,20),1),200);
  insert into tests (user_id, mode, time_limit_sec) values (auth.uid(), p_mode, p_time_limit_sec) returning id into v_test;
  insert into test_questions (test_id, question_id, position)
  select v_test, id, row_number() over () from (
    select q.id from questions q
    left join topics t on t.id = q.topic_id
    where q.status = 'published'
      and (p_topic_ids is null or q.topic_id = any(p_topic_ids))
      and (p_subject_ids is null or t.subject_id = any(p_subject_ids))
      and (not p_only_wrong or exists (
            select 1 from answers a where a.user_id = auth.uid() and a.question_id = q.id and a.is_correct = false))
      and (not p_unseen_only or not exists (
            select 1 from answers a where a.user_id = auth.uid() and a.question_id = q.id))
    order by random() limit p_count
  ) s;
  get diagnostics v_n = row_count;
  if v_n = 0 then
    delete from tests where id = v_test;
    raise exception 'no questions match';
  end if;
  return v_test;
end $$;
revoke execute on function create_test(text,int,int[],int[],boolean,boolean,int) from public, anon;
grant execute on function create_test(text,int,int[],int[],boolean,boolean,int) to authenticated;
