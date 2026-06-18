-- Provider keys were copied to ai_provider_keys in 0009. Keep the legacy
-- ai_settings row only for the active provider selection, without a duplicate
-- plaintext credential.
UPDATE `ai_settings`
SET `api_key` = ''
WHERE `api_key` <> '';
