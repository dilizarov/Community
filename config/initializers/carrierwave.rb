CarrierWave.configure do |config|
  config.fog_credentials = {
    provider: 'AWS',
    aws_access_key_id: 'AKIAJGSLB2E7AK7X2T4Q',
    aws_secret_access_key: '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'
  }


  config.fog_directory = "communitydev"
  config.fog_public = true
  config.fog_attributes = { 'Cache-Control' => "max-age=#{365.day.to_i}"}
end
