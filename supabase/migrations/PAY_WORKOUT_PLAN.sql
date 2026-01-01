CREATE OR REPLACE FUNCTION pay_for_workout_plan(
  p_user_id UUID,
  p_plan_id UUID
) RETURNS JSON AS $$
DECLARE
  v_plan_price INTEGER;
  v_trainer_id UUID;
  v_user_balance INTEGER;
  v_wallet_id UUID;
  v_trainer_wallet_id UUID;
BEGIN
  -- Get plan details
  SELECT price, trainer_id INTO v_plan_price, v_trainer_id
  FROM workout_plans WHERE id = p_plan_id;

  IF v_plan_price IS NULL OR v_plan_price = 0 THEN
      -- Free plan? Just activate
      UPDATE workout_plans SET payment_status = 'paid', status = 'active' WHERE id = p_plan_id;
      RETURN json_build_object('success', true);
  END IF;

  -- Get user wallet
  SELECT id, balance INTO v_wallet_id, v_user_balance
  FROM wallets WHERE user_id = p_user_id;

  IF v_user_balance < v_plan_price THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient funds');
  END IF;

  -- Get trainer wallet
  SELECT id INTO v_trainer_wallet_id
  FROM wallets WHERE user_id = v_trainer_id;

  -- Dedudct from user
  UPDATE wallets SET balance = balance - v_plan_price WHERE id = v_wallet_id;
  
  -- Add transaction for user
  INSERT INTO transactions (wallet_id, amount, type, description, related_entity_id)
  VALUES (v_wallet_id, -v_plan_price, 'purchase', 'Acquisto Scheda Allenamento', p_plan_id);

  -- Credit trainer (90%)
  UPDATE wallets SET balance = balance + (v_plan_price * 0.9) WHERE id = v_trainer_wallet_id;

   -- Add transaction for trainer
  INSERT INTO transactions (wallet_id, amount, type, description, related_entity_id)
  VALUES (v_trainer_wallet_id, (v_plan_price * 0.9), 'earnings', 'Vendita Scheda Allenamento', p_plan_id);
  
  -- Update plan status
  UPDATE workout_plans SET payment_status = 'paid', status = 'active' WHERE id = p_plan_id;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
