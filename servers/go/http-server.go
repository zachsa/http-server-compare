package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

const defaultPort = 3000

func main() {
	// Set up signal capturing
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	// Get the port from the command line arguments
	port := defaultPort
	if len(os.Args) > 1 {
		if customPort, err := strconv.Atoi(os.Args[1]); err == nil {
			port = customPort
		}
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprint(w, "1")
	})

	// Define the HTTP server
	srv := &http.Server{
		Addr: fmt.Sprintf(":%d", port),
	}

	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			// unexpected error. port in use?
			panic(err)
		}
	}()

	// Wait for interrupt signal
	<-signals

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		panic(err) // failure/timeout shutting down the server gracefully
	}
}
