-- Enable the pg_net extension to allow making HTTP requests
create extension if not exists "pg_net";

-- Create a function to trigger the webhook
create or replace function public.handle_new_reservation_or_order()
returns trigger as $$
begin
  perform
    net.http_post(
      url := 'https://yayoxqzxmijzipryevcr.supabase.co/functions/v1/push-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheW94cXp4bWlqemlwcnlldmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzY5ODIsImV4cCI6MjA3Nzc1Mjk4Mn0.WUT4oCXU_vbanm2sQPjBWxXfcPcllyKju2F_P3K1qqI"}'::jsonb,
      body := jsonb_build_object(
        'record', row_to_json(new),
        'type', TG_OP,
        'table', TG_TABLE_NAME
      )
    );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for Reservations
drop trigger if exists on_new_reservation on public.reservations;
create trigger on_new_reservation
  after insert on public.reservations
  for each row execute procedure public.handle_new_reservation_or_order();

-- Trigger for Orders
drop trigger if exists on_new_order on public.orders;
create trigger on_new_order
  after insert on public.orders
  for each row execute procedure public.handle_new_reservation_or_order();
