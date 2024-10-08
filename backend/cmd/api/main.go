package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
	"sync"

	"github.com/mnabil1718/blog.mnabil.dev/internal/data"
	"github.com/mnabil1718/blog.mnabil.dev/internal/jsonlog"
	"github.com/mnabil1718/blog.mnabil.dev/internal/mailer"
)

var (
	version string = "1.0.0"
)

type config struct {
	port        int
	env         string
	host        string
	frontendUrl string
	db          struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  string
	}
	limiter struct {
		rps     float64
		burst   int
		enabled bool
	}
	smtp struct {
		host     string
		port     int
		username string
		password string
		sender   string
	}
	cors struct {
		trustedOrigins []string
	}
}

type application struct {
	logger *jsonlog.Logger
	config config
	models data.Models
	wg     sync.WaitGroup
	mailer mailer.Mailer
}

func main() {

	var cfg config

	flag.StringVar(&cfg.host, "host", "localhost", "Application Server Hostname")
	flag.IntVar(&cfg.port, "port", 8080, "Application Server Port Number")
	flag.StringVar(&cfg.db.dsn, "db-dsn", "postgres://blog:Cucibaju123@localhost:5432/blog", "PostgreSQL Connection String")
	flag.StringVar(&cfg.frontendUrl, "frontend-url", "http://localhost:3000", "Frontend URL")

	flag.StringVar(&cfg.env, "env", "dev", "Application Environment: (dev|staging|prod)")

	flag.IntVar(&cfg.db.maxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.db.maxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.StringVar(&cfg.db.maxIdleTime, "db-max-idle-time", "15m", "PostgreSQL max connection idle time")

	flag.Float64Var(&cfg.limiter.rps, "limiter-rps", 2, "Rate limiter maximum requests per second")
	flag.IntVar(&cfg.limiter.burst, "limiter-burst", 4, "Rate limiter maximum burst")
	flag.BoolVar(&cfg.limiter.enabled, "limiter-enabled", true, "Enable rate limiter")

	flag.StringVar(&cfg.smtp.host, "smtp-host", "sandbox.smtp.mailtrap.io", "SMTP host")
	flag.IntVar(&cfg.smtp.port, "smtp-port", 25, "SMTP port")
	flag.StringVar(&cfg.smtp.username, "smtp-username", "ec3025ad72b125", "SMTP username")
	flag.StringVar(&cfg.smtp.password, "smtp-password", "373c5780d64d98", "SMTP password")
	flag.StringVar(&cfg.smtp.sender, "smtp-sender", "blog.mnabil.dev <no-reply@blog.mnabil.dev>", "SMTP sender")

	flag.Func("cors-trusted-origins", "Trusted CORS origins (space separated) e.g. http://localhost:3000", func(val string) error {
		cfg.cors.trustedOrigins = strings.Fields(val)
		return nil
	})

	displayVersion := flag.Bool("version", false, "Display version and exit")

	flag.Parse()

	if *displayVersion {
		fmt.Printf("Version:\t%s\n", version)
		os.Exit(0)
	}

	logger := jsonlog.New(os.Stdout, jsonlog.LevelInfo)

	db, err := openDB(cfg)
	if err != nil {
		logger.PrintFatal(err, nil)
	}
	defer db.Close()

	logger.PrintInfo("database connection pool established successfully.", nil)

	app := application{
		logger: logger,
		config: cfg,
		models: data.NewModels(db),
		mailer: mailer.New(cfg.smtp.host, cfg.smtp.port, cfg.smtp.username, cfg.smtp.password, cfg.smtp.sender),
	}

	err = app.serve()
	if err != nil {
		logger.PrintFatal(err, nil)
	}

}
