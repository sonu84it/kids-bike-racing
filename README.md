# Kids Bike Racing

A small side-scrolling racing game built with Flask and vanilla JavaScript. Collect stars, avoid rocks and try to finish with time left!

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

Open <http://localhost:5000> in your browser.

## Deploy

This app can be easily deployed to services such as Render or Heroku using the provided `requirements.txt` and `Procfile` style startup (`flask run`).

## How to play Kids Bike Racing

### Objective

Ride your bike along the side-scrolling track, collecting stars and avoiding rocks while racing to the finish before time runs out.

### Starting the game

When the page loads, enter how many minutes you want to play and click Play to begin.

### Controls

Accelerate: Hold the right-arrow key or tap/press the on-screen ▶ button to speed up

Jump: Press the space bar or tap/press the on-screen ⬆ button to hop over obstacles

Slow Down: Hold the down-arrow key or tap/press the on-screen ⬇ button to ride at a reduced speed

Releasing the right-arrow key or lifting your finger from the ▶ button slows the bike to normal speed

### Gameplay mechanics

Grabbing a star increases your star count, while hitting a rock deducts 2 seconds from the timer

You lose if the timer reaches zero and win by covering the required distance before time runs out

### After the race

Once the race ends, your score (based on remaining time and collected stars) is displayed with an option to play again
