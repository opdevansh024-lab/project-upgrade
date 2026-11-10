create table if not exists public.fitness_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.fitness_state enable row level security;

revoke all on table public.fitness_state from anon;
grant select, insert, update, delete on table public.fitness_state to authenticated;

drop policy if exists "Users can read their own fitness state" on public.fitness_state;
create policy "Users can read their own fitness state"
  on public.fitness_state for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own fitness state" on public.fitness_state;
create policy "Users can insert their own fitness state"
  on public.fitness_state for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own fitness state" on public.fitness_state;
create policy "Users can update their own fitness state"
  on public.fitness_state for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own fitness state" on public.fitness_state;
create policy "Users can delete their own fitness state"
  on public.fitness_state for delete to authenticated
  using ((select auth.uid()) = user_id);

