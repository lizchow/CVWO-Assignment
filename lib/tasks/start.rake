namespace :start do
    task :development do
      exec 'heroku local -f Procfile.dev'
    end
  enddesc 'Start development server'
  task :start => 'start:development'