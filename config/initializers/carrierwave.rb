CarrierWave.configure do |config|
  config.fog_credentials = {
    provider: 'AWS',
    aws_access_key_id: 'AKIAJONGACZLZ5A5H2ZQ',
    aws_secret_access_key: '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',
    region: 'us-west-2'
  }
  
  config.fog_directory = "communitydev"
  config.fog_public = false
end