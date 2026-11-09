// The Batin write-up as data, generated from the finished paper so the page and the paper match.
export const batinWriteup = {
 "title": "Does options flow predict stock returns? Twelve nulls and one thin pass",
 "blocks": [
  {
   "t": "h2",
   "text": "Abstract"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "A popular idea in retail trading says: watch the options market, find where big money is betting against the crowd, and follow it. I built a product on that idea, called Batin, and then tested it. This paper reports every test, including the ones that failed."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Across about 4.25 billion US option trades from 2022 to 2026, I ran thirteen analyses. Twelve found nothing usable. Following large traders against small ones was right 49.4% of the time on a held-out year, with rules written before the year was scored."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "One narrow rule passed one locked test. Before earnings, days when large single-leg option orders leaned bullish beat days they leaned bearish by 56 basis points over five days, net of the market. The 95% interval runs from 5 to 108. The rule was right only 50.6% of the time, and my estimate is about even odds that the effect is real."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "That rule is now locked for a second test on 2026 to 2028 data, none of which existed when the rules were fixed. Batin carries no predictive claim. What it has is a complete record of what was tested and how."
    }
   ]
  },
  {
   "t": "h2",
   "text": "1. Introduction"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The claim tested here is simple: when large option traders lean one way and small traders lean the other, the stock follows the large traders."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The claim has a real pedigree. Options offer leverage, so a trader with information might use them first (Black, 1975; Easley, O'Hara and Srinivas, 1998). Pan and Poteshman (2006) found that stocks with low put-call ratios beat stocks with high ratios by more than 1% over the next week. A whole category of retail products sells some version of the idea, under names like unusual options activity and smart money flow."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Those products rarely show their accuracy. I looked for a seller of flow signals that publishes out-of-sample results for them and did not find one. Institutional vendors sell the ingredient instead: OptionMetrics, for example, sells signed option volume split into retail and institutional trades, and leaves the testing to the buyer."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "I built one of these products, Batin, and meant to license it to trading firms. Before selling it I tested it, and it failed. This paper is the record of that testing. It offers three things."
    }
   ]
  },
  {
   "t": "ol",
   "items": [
    [
     {
      "b": 1,
      "s": "A clean null on the popular claim."
     },
     {
      "s": " With rules committed before scoring, following large traders against small ones was right 49.4% of the time over 11,389 events in a held-out year. Betting against them was right 51.1%."
     }
    ],
    [
     {
      "b": 1,
      "s": "One narrow positive result, stated with its limits."
     },
     {
      "s": " A pre-earnings rule passed a locked test on fresh data by a thin margin. It is not right more often than chance, and it is too small to trade."
     }
    ],
    [
     {
      "b": 1,
      "s": "A method one person can afford."
     },
     {
      "s": " Four years of trade-level data came from one $80 month of a retail feed and ran on a free server. The discipline that made the results believable cost nothing: write the rules first, hold data back, score once."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Section 2 places the work in the published research. Sections 3 and 4 describe the system and the method. Section 5 gives every result, section 6 the mistakes caught on the way, and section 7 the test now locked for 2027 and 2028. Nothing here is trading advice."
    }
   ]
  },
  {
   "t": "h2",
   "text": "2. Related work"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Published research supports a weaker and narrower claim than the one retail products sell, and my results fit it."
    }
   ]
  },
  {
   "t": "h3",
   "text": "2.1 Does option flow predict the stock?"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The theory is old. Black (1975) argued that the leverage in options should attract informed traders. Easley, O'Hara and Srinivas (1998) modelled the choice between the two markets and found that signed option volume carries information about future stock prices."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The strongest evidence is Pan and Poteshman (2006). They built put-call ratios from volume that buyers initiated to open new positions, and low-ratio stocks beat high-ratio stocks by more than 40 basis points the next day. Their data came from the exchange and sorted volume by trader type and by opening or closing. A trade feed does not carry those labels, so anyone using one has to guess the side from quotes, as I do."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Johnson and So (2012) used only volume that anyone can see. Stocks with a low ratio of option volume to stock volume beat those with a high ratio by 0.34% a week. I screened that result on my data in section 5.5."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Recent work is more sceptical about what the patterns mean. Muravyev, Pearson and Pollet (2025) show that the return predictability of implied-volatility measures falls by at least two thirds once stocks that are expensive to borrow are removed. The signal is partly the cost of shorting, not private information. Bryzgalova, Pavlova and Sikorskaya (2023) document the rise of retail option trading and find that retail investors favour cheap weekly options with wide spreads and lose money on average."
    }
   ]
  },
  {
   "t": "h3",
   "text": "2.2 Earnings"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The one place my data showed anything is also where the literature is most specific. Amin and Lee (1997) found that option activity rises by more than 10% in the four days before quarterly earnings, and that the direction of that trading foreshadows the news."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The modern evidence is mixed, which is a reason for caution. Cremers, Fodor, Muravyev and Weinbaum (2023) find that option buying predicts returns before unscheduled news but not before scheduled news such as earnings, while option selling predicts returns only ahead of scheduled releases. After the report, Bernard and Thomas (1989) is the classic account of prices drifting in the direction of the surprise. I screened a version of that drift too."
    }
   ]
  },
  {
   "t": "h3",
   "text": "2.3 Option prices and volatility"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Options data predicts option returns better than it predicts stocks. Muravyev (2016) shows that past order imbalance forecasts next-day option returns, because market makers charge for carrying inventory. Garleanu, Pedersen and Poteshman (2009) show how demand moves option prices when dealers cannot hedge perfectly. Ni, Pan and Poteshman (2008) find that demand for volatility from non-market-makers forecasts the stock's realized volatility. I tested versions of the first and third on my data."
    }
   ]
  },
  {
   "t": "h3",
   "text": "2.4 Why a backtest fools its author"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The method in this paper comes from the research on false discoveries. Harvey, Liu and Zhu (2016) argue that after decades of data mining a new return predictor should clear a t-statistic of 3.0, and that most claimed findings in the field are likely false. Bailey, Borwein, Lopez de Prado and Zhu (2014) show that trying even a modest number of strategy variants on the same history produces impressive backtests that fail on new data."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The remedy is borrowed from other sciences. Nosek, Ebersole, DeHaven and Mellor (2018) describe preregistration: fixing the question and the analysis before seeing the outcome, so that a prediction cannot be confused with an explanation made afterwards. That is the rule every decisive test here follows."
    }
   ]
  },
  {
   "t": "h2",
   "text": "3. System and data"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Batin was a nightly pipeline on one free server, plus a research path that pulled every trade."
    }
   ]
  },
  {
   "t": "figure",
   "n": 1,
   "caption": "ThetaData feeds both paths. Yahoo Finance feeds the nightly job and is read again when a test is scored.",
   "source": "the system as it ran in October 2026"
  },
  {
   "t": "h3",
   "text": "3.1 The product pipeline"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Until November 2026, a Python job loaded about 140,000 option contract rows each weekday evening, after the vendor's end-of-day report. The rows landed in TimescaleDB, a FastAPI engine scored them and a Next.js terminal displayed them. Everything ran in Docker on a free ARM virtual machine with 2 cores and 12 GB of memory. The nightly job was switched off on 8 November 2026."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The product shows two numbers. The Batin Index measures how far large traders lean against small ones, bounded at plus or minus 100. The Trap Score, from 0 to 100, measures how sharply the two groups oppose each other. One shared math module computes both, with 87 unit tests, so the product and every backtest use the same formulas."
    }
   ]
  },
  {
   "t": "h3",
   "text": "3.2 The research data"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "End-of-day rows fold a whole day into one line per contract, so one huge order and many small ones look the same. To see individual orders I moved to ThetaData's Options Standard feed: every US option trade reported through OPRA, with the national best bid and offer just before it. Stock prices, splits and earnings dates come from Yahoo Finance through the yfinance library."
    }
   ]
  },
  {
   "t": "table",
   "head": true,
   "rows": [
    [
     "Pull",
     "Period",
     "Ticker-days",
     "Trades",
     "Run time"
    ],
    [
     "Order-level pull",
     "2024-09-06 to 2026-10-07",
     "52,300",
     "about 2.57 billion",
     "15.7 hours"
    ],
    [
     "Fresh earlier years",
     "2022-08-29 to 2024-09-06",
     "50,900",
     "about 1.68 billion",
     "12.25 hours"
    ],
    [
     "Total",
     "four years",
     "103,200",
     "about 4.25 billion",
     "0 failed ticker-days"
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The later period had been pulled once before at the trade level, about 2.55 billion trades in 18.6 hours. Print counts matched on all 52,098 ticker-days the two pulls share. The feed allows four requests at once, so each pull is resumable, writes its files atomically and pauses while the nightly job runs."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The stocks are SPY, QQQ, IWM and the 97 S&P 500 stocks with the most option volume. Each test ranks them on a week before its own window, so the list never uses hindsight about which names became popular later."
    }
   ]
  },
  {
   "t": "h3",
   "text": "3.3 From trades to orders"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "A large order often prints as many small trades, so orders have to be rebuilt before anything can be measured."
    }
   ]
  },
  {
   "t": "figure",
   "n": 2,
   "caption": "An order counts only if it is a single leg, worth $100,000 or more and clearly bought or sold. A stock-day counts only if it leans clearly and earnings are near.",
   "source": "the event rules in preregEarningsLean.md, section 3"
  },
  {
   "t": "ol",
   "items": [
    [
     {
      "b": 1,
      "s": "Glue."
     },
     {
      "s": " Prints of the same contract, on the same side, within 10 milliseconds of each other are one order."
     }
    ],
    [
     {
      "b": 1,
      "s": "Side."
     },
     {
      "s": " Each print is compared with the quote just before it: at the ask it was bought, at the bid it was sold (the quote rule of Lee and Ready, 1991). An order's side weight is its signed contracts divided by its contracts."
     }
    ],
    [
     {
      "b": 1,
      "s": "Drop spreads."
     },
     {
      "s": " Multi-leg trades are removed, since one leg of a spread says nothing about direction. In the pilot they were 14% of contracts but 32.5% of premium."
     }
    ],
    [
     {
      "b": 1,
      "s": "Stance."
     },
     {
      "s": " A bought call or a sold put is bullish. A bought put or a sold call is bearish."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Two checks say the rebuild is sound. Rebuilt volume matched the official end-of-day totals, with a median ratio of 1.000. And 86.8% of single-leg contracts traded at the bid or the ask, so most trades can be given a side."
    }
   ]
  },
  {
   "t": "h2",
   "text": "4. Method"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Every decisive test followed one rule: the rules were committed before any result was computed, and the test was scored once."
    }
   ]
  },
  {
   "t": "h3",
   "text": "4.1 Rules before results"
  },
  {
   "t": "figure",
   "n": 3,
   "caption": "Each step happens once and in order. Results first appear at the score, and after the lock only a dated amendment for a genuine bug can change anything.",
   "source": "the steps listed below"
  },
  {
   "t": "ol",
   "items": [
    [
     {
      "b": 1,
      "s": "Write the rules."
     },
     {
      "s": " One file states the data, the events, the outcome, the statistic and the pass bar."
     }
    ],
    [
     {
      "b": 1,
      "s": "Rehearse on data already seen."
     },
     {
      "s": " The scoring code runs on old data to prove it reproduces a known number. This checks the code, not the idea."
     }
    ],
    [
     {
      "b": 1,
      "s": "Lock."
     },
     {
      "s": " The rules file is committed to git and pushed. The scoring script stores the file's sha256 hash and refuses to run if the file has changed."
     }
    ],
    [
     {
      "b": 1,
      "s": "Check the data, with no outcomes."
     },
     {
      "s": " Exclusions come from these checks alone and are written down before scoring."
     }
    ],
    [
     {
      "b": 1,
      "s": "Run blind."
     },
     {
      "s": " Every code path runs once with the outcomes replaced by random noise, so a crash cannot happen with the real answer on screen."
     }
    ],
    [
     {
      "b": 1,
      "s": "Score once."
     },
     {
      "s": " The script writes a marker file and refuses to run again."
     }
    ],
    [
     {
      "b": 1,
      "s": "Amend only in the open."
     },
     {
      "s": " A genuine bug gets a dated note in the rules file. Nothing else changes after the lock."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "A fail is reported as a fail, and a failed idea is not retried on another period."
    }
   ]
  },
  {
   "t": "h3",
   "text": "4.2 Which data each test may touch"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "A year is clean only until someone looks at it, so each year had one job."
    }
   ]
  },
  {
   "t": "figure",
   "n": 4,
   "caption": "The grey periods were each used once. Everything highlighted was fixed on 13 October 2026, before any of it had traded.",
   "source": "dates from the locked rules files"
  },
  {
   "t": "table",
   "head": true,
   "rows": [
    [
     "Period",
     "Role",
     "Used by"
    ],
    [
     "2022-08-30 to 2024-09-05",
     "Fresh years, pulled last",
     "The locked pre-earnings test, scored once"
    ],
    [
     "2024-10-07 to 2025-10-06",
     "Development year",
     "Rehearsals and open exploration"
    ],
    [
     "2025-10-07 to 2026-10-06",
     "Held-out year",
     "The locked Trap Score tests, scored once"
    ],
    [
     "2026-10-19 to 2028-09-30",
     "Not yet traded at the lock",
     "The deferred test in section 7"
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Stock direction was tested on the held-out year once and may not be tested on it again. That is why the pre-earnings idea, found in the development year, needed two earlier years pulled fresh."
    }
   ]
  },
  {
   "t": "h3",
   "text": "4.3 Outcome"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Every stock outcome is net of the market. It is the stock's return minus its beta times SPY's return over the same span, with beta taken from the 60 trading days before. For the pre-earnings test the span runs from the open of the day after the orders to the close five trading days later."
    }
   ]
  },
  {
   "t": "h3",
   "text": "4.4 Statistics"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Two statistics carry the results."
    }
   ]
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "b": 1,
      "s": "Hit rate."
     },
     {
      "s": " The share of events where the stock moved the predicted way, with a 95% interval. A coin flip is 50%."
     }
    ],
    [
     {
      "b": 1,
      "s": "Gap."
     },
     {
      "s": " The mean outcome on bullish days minus the mean on bearish days, in basis points. Its interval comes from a block bootstrap (Kunsch, 1989): blocks of 20 consecutive trading days are resampled 2,000 times, so days that move together stay together."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "A second test added to data already in use had to clear a wider 97.5% interval. The pre-earnings test had to clear five gates at once."
    }
   ]
  },
  {
   "t": "ol",
   "items": [
    [
     {
      "s": "The lower end of the 95% interval is above zero."
     }
    ],
    [
     {
      "s": "The gap is at least 20 basis points."
     }
    ],
    [
     {
      "s": "Each side has at least 300 stock-days."
     }
    ],
    [
     {
      "s": "Each side has at least 150 separate earnings events."
     }
    ],
    [
     {
      "s": "The gap is still at least 20 basis points after each stock's own average move is removed."
     }
    ]
   ]
  },
  {
   "t": "h2",
   "text": "5. Results"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Twelve of thirteen analyses found nothing usable, and the thirteenth passed thinly."
    }
   ]
  },
  {
   "t": "table",
   "head": true,
   "rows": [
    [
     "#",
     "Analysis",
     "Data",
     "Result",
     "Verdict"
    ],
    [
     "1 to 5",
     "Trap Score, five end-of-day backtests",
     "Eight months, up to 519 tickers",
     "5-day hit rate 53.6% (49.6 to 57.5) on 12 mega-caps; 43.6% (29.3 to 59.0) at Trap Score 60 and up",
     "No edge"
    ],
    [
     "6",
     "Follow large traders, locked",
     "Held-out year, 11,389 events",
     "Hit rate 49.4% (47.9 to 50.8)",
     "Fail"
    ],
    [
     "7",
     "Bet against large traders at the biggest standoffs, locked",
     "Held-out year, 2,565 events",
     "Hit rate 51.1% (47.5 to 54.3, a 97.5% interval)",
     "Fail"
    ],
    [
     "8",
     "Flow pressure on option prices",
     "Development year",
     "Next-day hedged option return +5.5 bps, t = 0.69",
     "No edge"
    ],
    [
     "9",
     "Demand for volatility against straddles",
     "Development year",
     "+0.62%, t = 1.56, the wrong sign",
     "Bar not met"
    ],
    [
     "10",
     "Lean of large orders, about 25 cuts",
     "Development year, 1.69 million orders",
     "Gap +4 bps (-15 to +26)",
     "No edge"
    ],
    [
     "11",
     "Pre-earnings lean, locked",
     "2022 to 2024, fresh",
     "Gap +56.0 bps (+5.1 to +108.2)",
     "Pass, thin"
    ],
    [
     "12",
     "Option-to-stock volume, screen",
     "2022 to 2025",
     "Gap +1.9 bps a week (-26.0 to +30.2)",
     "Fail"
    ],
    [
     "13",
     "Earnings reaction drift, screen",
     "2022 to 2025",
     "Raw gap +53.7 bps (+0.7 to +123.2); -36.9 after the stock's own average",
     "Fail"
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Intervals are 95% unless marked. Rows 12 and 13 use 97.5% intervals."
    }
   ]
  },
  {
   "t": "h3",
   "text": "5.1 The Trap Score on end-of-day data"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The product's headline number did not predict direction. I rebuilt the score day by day, using only what was known at the time, and measured where each stock went next. Five backtests agreed: the hit rate was a coin flip, and higher Trap Scores did worse, not better."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Two fixes to the score's math were tested the same way. Neither moved the result."
    }
   ]
  },
  {
   "t": "h3",
   "text": "5.2 Every trade, with the rules written first"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Better data did not rescue the idea. The locked test defined a large order as the top 0.1% of that stock's orders over the prior 20 days, dropped spreads, and let a held-out year alone decide."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The development year showed something odd: large traders were more wrong as the Trap Score rose. Betting against them at the highest scores would have been right 56% of the time. I registered that second idea before the held-out year was scored, with a wider interval for running two tests, and wrote down where it came from."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Then the held-out year was scored once. Following large traders was right 49.4% of the time. Betting against them was right 51.1%. Both intervals include 50%. The 56% had been noise."
    }
   ]
  },
  {
   "t": "h3",
   "text": "5.3 Does this data predict anything else?"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "With the product idea closed, I asked a wider question on the development year only."
    }
   ]
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "b": 1,
      "s": "Flow pressure."
     },
     {
      "s": " Muravyev (2016) predicts that heavy option buying pushes a price up and that it then falls back. I found no reversal: +5.5 bps the next day, against a typical bid-ask spread of 2.6% to 3.4% of the option's price. Any effect is tens of times smaller than the cost of trading it."
     }
    ],
    [
     {
      "b": 1,
      "s": "Demand for volatility."
     },
     {
      "s": " A test with its bar fixed in advance pointed the wrong way."
     }
    ],
    [
     {
      "b": 1,
      "s": "Large orders."
     },
     {
      "s": " Across 1.69 million single-leg orders of $100,000 or more, days that leaned bullish beat days that leaned bearish by 4 bps over five days. I cut that about 25 ways. Nearly every cut included zero, which is what chance gives."
     }
    ]
   ]
  },
  {
   "t": "h3",
   "text": "5.4 The pre-earnings lean"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "One cut had an economic story behind it: how large orders lean in the ten trading days before a company reports earnings. A story is not evidence, and I had found it by looking, so it went to a locked test on two fresh years."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "It passed all five gates. Days when large orders leaned bullish beat days they leaned bearish by 56.0 bps over the next five days, net of the market, across 1,634 bullish and 1,483 bearish stock-days. The interval runs from 5.1 to 108.2. With each stock's own average move removed the gap is 55.8 bps."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "It would be easy to call that a win. It is not one yet."
    }
   ]
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "s": "The interval clears zero by 5 basis points."
     }
    ],
    [
     {
      "s": "The rule was right 50.6% of the time, against 50.0% for no skill. The gap comes from the size of the moves, not from being right more often."
     }
    ],
    [
     {
      "s": "One stock, Carvana, supplies about a quarter of the gap."
     }
    ],
    [
     {
      "s": "Only the bullish side earned anything: about +52 bps on bullish days and about -4 on bearish days."
     }
    ],
    [
     {
      "s": "The very largest orders, $1 million and up, point the other way."
     }
    ],
    [
     {
      "s": "It is one pass among thirteen analyses, and it was the best of about 25 cuts."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "One thing it is not is momentum in disguise. Holding the stock's own recent moves fixed, the effect is 54.5 bps (4.8 to 108.5). After a hard review, my estimate is odds of 40 to 50% that the effect is real, and about half the measured size if it is."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "It is not a trading system. At face value the edge on a position is about one-fiftieth of that position's typical swing."
    }
   ]
  },
  {
   "t": "h3",
   "text": "5.5 Two ideas from the literature"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Two published ideas were screened on data I had already used, so a pass would only have earned a later test. Both failed."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The option-to-stock volume ratio of Johnson and So (2012) showed nothing: 1.9 bps a week, with an interval from -26.0 to +30.2. That rules out a large effect on these stocks. It cannot rule out one the size the paper found for this construction, about 17 bps a week."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Earnings reaction drift had a positive raw gap and failed one gate. That gate turned out to be biased against it, which section 6 explains. The verdict stays a fail."
    }
   ]
  },
  {
   "t": "h2",
   "text": "6. Mistakes caught along the way"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Five errors mattered. Four were caught before a locked test was scored, and one was not."
    }
   ]
  },
  {
   "t": "h3",
   "text": "6.1 The answer key in the closing report"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "My first rule took each option's delta from that day's closing report. For a contract expiring that same day, the closing delta is just the outcome: about 1 if it finished in the money, 0 if not. Those contracts were 53% of SPY's trades."
    }
   ]
  },
  {
   "t": "figure",
   "n": 5,
   "caption": "For a contract that expires that day, the 17:15 delta is set after the outcome is known. The fix uses the previous day's delta, which is set before the trade.",
   "source": "one trading day, schematic; the 53% and 22% are SPY's"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The rule would have quietly dropped 22% of SPY's trades, and specifically the losing ones. A small smoke test caught it before the full run, and the fix was one line: use the previous day's delta. I would not have found it by staring at results, because the results would have looked great."
    }
   ]
  },
  {
   "t": "h3",
   "text": "6.2 Closing quotes taken after the close"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The vendor's end-of-day quotes are taken at 17:15 New York time, after the close, and are often far wider than trading quotes. One straddle's spread was 2% one day and 17% the next. My first cost estimate was wrong because of it, so I measured costs again from the quote at the moment of each trade."
    }
   ]
  },
  {
   "t": "h3",
   "text": "6.3 A table that mirrored itself"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "My first direction table compared bullish orders with bearish orders. Most stock-days have both, so the two rows were mirror images of each other and showed only how busy stocks did that year. The right unit is one stock-day and its net lean."
    }
   ]
  },
  {
   "t": "h3",
   "text": "6.4 Wrong earnings dates in the source"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "A hand check of five earnings dates found one wrong: the source had Costco's report a week late. I widened the check to 36 dates against company releases and filings, and corrected six in a dated amendment before scoring. Without the corrections the result is the same, 56.3 bps."
    }
   ]
  },
  {
   "t": "h3",
   "text": "6.5 A fairness gate that contained the signal"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "This one I did not catch in time. The gate that removes each stock's own average move was copied from the pre-earnings test into the earnings-drift screen. But drift is itself a price move after earnings, and the average being subtracted included those same moves. The gate was biased against the idea by about 90 bps."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "I found the error after scoring. One follow-up check, stated before it was run, gave 42.3 bps (-10.0 to +110.8) with report windows left out of the average. The verdict stays a fail. The accurate description is that the idea failed its locked screen on a gate that turned out to be biased against it."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The lesson applies to every test: before locking, ask of each gate and each baseline whether it contains the signal."
    }
   ]
  },
  {
   "t": "h2",
   "text": "7. The test locked for 2027 and 2028"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The pre-earnings rule gets one more test, on data that did not exist when its rules were fixed."
    }
   ]
  },
  {
   "t": "h3",
   "text": "7.1 Why not track it live"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "I first set up nightly paper tracking, with each evening's readings written to a hash-chained, time-stamped ledger before the next open. It never logged a day. The vendor does not serve a same-evening request for a whole option chain, and keeping the feed on for two years would have cost about $1,900 to settle an effect too small to trade."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "I withdrew the tracking on 13 October 2026, before a single entry existed, and recorded why. No live result was ever computed."
    }
   ]
  },
  {
   "t": "h3",
   "text": "7.2 What is locked"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "On the same day I locked a deferred test. These are fixed in advance and pinned by hash in one commit."
    }
   ]
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "b": 1,
      "s": "The rule"
     },
     {
      "s": ", unchanged from the 2022 to 2024 test."
     }
    ],
    [
     {
      "b": 1,
      "s": "The code"
     },
     {
      "s": " that rebuilds orders and the code that scores them."
     }
    ],
    [
     {
      "b": 1,
      "s": "The stocks"
     },
     {
      "s": ": the 97 S&P 500 stocks with the most option volume in the week of 5 October 2026, plus the next 150 as a wider set."
     }
    ],
    [
     {
      "b": 1,
      "s": "The entry days"
     },
     {
      "s": ": 19 October 2026 to 30 September 2028."
     }
    ],
    [
     {
      "b": 1,
      "s": "The bars"
     },
     {
      "s": " for stop and confirm."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Nothing happens until the period is over. Then the trades are pulled from the vendor's history, the pinned code runs on them, and the result is read. Read 1 covers the first year, in October 2027. Read 2 covers both years, in October 2028. Each is made once. Both reads can be made in the same month of 2028, so the whole test needs one more month of data."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The two stock lists stay private. The hashes of the rules, the scorer and both lists were meant to be posted publicly before the first entry day, 19 October 2026. They were posted late, on 8 November 2026, in "
    },
    {
     "href": "https://github.com/zakiaminn/batin-ledger-hashes",
     "s": "a public repository"
    },
    {
     "s": " with a note saying so. No trade-level data for the test period had been pulled by then."
    }
   ]
  },
  {
   "t": "figure",
   "n": 6,
   "caption": "The data goes in first, outcomes are seen only at the read, and each read is made once.",
   "source": "the commands in the header of scoreEarningsLeanDeferred.py"
  },
  {
   "t": "h3",
   "text": "7.3 The bars"
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "b": 1,
      "s": "Stop."
     },
     {
      "s": " The upper end of the 95% interval is below 20 bps, or the gap is at or below zero at read 1, or read 2 does not confirm. A stop closes the idea."
     }
    ],
    [
     {
      "b": 1,
      "s": "Confirm."
     },
     {
      "s": " The gap is at least 20 bps, each side has at least 300 stock-days and 150 earnings events, the gap survives removing each stock's own average, and the 90% interval is above zero."
     }
    ],
    [
     {
      "b": 1,
      "s": "Continue."
     },
     {
      "s": " Anything else at read 1. No claims are made."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The wider set of 247 stocks is read alongside under a stricter interval. Its verdict is always reported after the 97-stock verdict, never instead of it."
    }
   ]
  },
  {
   "t": "h3",
   "text": "7.4 What to expect"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "If the true effect is about 30 bps in both sets of stocks, the chance of reaching a confirm is about 45%. If there is no effect, a confirm is unlikely by design. Either way the test cannot make the rule tradeable."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "It is also not a live record. No call is written down before the open. What is fixed is the rule, the code and the stocks, so the calls follow from data nobody here controls. Earnings dates are the ones that happened, as in the 2022 to 2024 test, which makes this a replication on new years."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "If a read is never made, for example because the vendor no longer serves those years, the test will be reported as locked and never scored. That is not a fail, and it is not a pass."
    }
   ]
  },
  {
   "t": "h2",
   "text": "8. Limitations"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The nulls are nulls for this definition of flow on these stocks, and the one pass is weaker than its headline number."
    }
   ]
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "b": 1,
      "s": "Size is not identity."
     },
     {
      "s": " I infer who is large from the size of an order. The feed does not say who traded or whether a trade opened a position, which is the information Pan and Poteshman (2006) had."
     }
    ],
    [
     {
      "b": 1,
      "s": "One feed, one side rule."
     },
     {
      "s": " Sides come from the quote before each print. Orders worked slowly through the day, or hidden inside spreads, are not seen as one order."
     }
    ],
    [
     {
      "b": 1,
      "s": "A narrow universe."
     },
     {
      "s": " The tests cover about 100 of the most active names, drawn from the S&P 500 as it stood at each ranking. Smaller stocks may behave differently."
     }
    ],
    [
     {
      "b": 1,
      "s": "Short horizons only."
     },
     {
      "s": " Outcomes run from one to ten trading days. Intraday effects and longer horizons were not tested."
     }
    ],
    [
     {
      "b": 1,
      "s": "One market regime."
     },
     {
      "s": " The data runs from 2022 to 2026."
     }
    ],
    [
     {
      "b": 1,
      "s": "The pass was found by looking."
     },
     {
      "s": " The pre-earnings rule was the best of about 25 cuts on one year. A locked test on fresh data answers most of that worry, not all of it."
     }
    ],
    [
     {
      "b": 1,
      "s": "Earnings dates as they happened."
     },
     {
      "s": " The test uses realized report dates, not the dates scheduled in advance. The effect of that is small but real."
     }
    ],
    [
     {
      "b": 1,
      "s": "Exploration is exploration."
     },
     {
      "s": " Results 8 to 10 come from one development year and were never meant to decide anything."
     }
    ],
    [
     {
      "b": 1,
      "s": "Costs."
     },
     {
      "s": " At its measured size the pre-earnings edge is about one-fiftieth of a position's typical swing. At the likelier smaller size it is about zero after costs."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "None of this shows that nobody can extract information from option flow. It shows that this popular recipe, built from data a retail subscriber can buy, did not."
    }
   ]
  },
  {
   "t": "h2",
   "text": "9. Conclusion"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The product idea did not survive testing, and the testing is the part worth keeping."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Large option traders leaning against small ones did not predict stock direction at one to five days, on end-of-day data or on every trade. Patterns that showed up in one year disappeared in the next. One narrow pre-earnings rule passed one locked test thinly, and its second test is locked for data that does not exist yet."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Batin carries no predictive claim. What it has is a complete record: thirteen analyses, the rules each one ran under, and the failures reported as failures."
    }
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "What I would tell anyone testing a signal:"
    }
   ]
  },
  {
   "t": "ol",
   "items": [
    [
     {
      "s": "Write the rules down and commit them before you compute a single return."
     }
    ],
    [
     {
      "s": "Hold data back and score it once. If you look twice, it is not held out."
     }
    ],
    [
     {
      "s": "Run a small smoke test before the big run. The leak I caught would have made a dead signal look alive."
     }
    ],
    [
     {
      "s": "Measure the cost of trading at the moment of the trade, not from closing quotes."
     }
    ],
    [
     {
      "s": "Before you lock a test, ask of every gate and baseline whether it contains the signal."
     }
    ],
    [
     {
      "s": "When something passes, list everything that makes it weaker than it looks, and then test it on data that does not exist yet."
     }
    ],
    [
     {
      "s": "Report the failures as failures. Twelve nulls are a result."
     }
    ]
   ]
  },
  {
   "t": "h2",
   "text": "References"
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "Bibliographic details were checked against the linked pages on 13 October 2026. Findings are quoted from abstracts, not from a reading of each full text."
    }
   ]
  },
  {
   "t": "ul",
   "items": [
    [
     {
      "s": "Amin, K. I. and Lee, C. M. C. (1997). "
     },
     {
      "href": "https://ideas.repec.org/a/wly/coacre/v14y1997i2p153-192.html",
      "s": "Option trading, price discovery, and earnings news dissemination"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Contemporary Accounting Research"
     },
     {
      "s": ", 14(2), 153-192."
     }
    ],
    [
     {
      "s": "Bailey, D. H., Borwein, J. M., Lopez de Prado, M. and Zhu, Q. J. (2014). "
     },
     {
      "href": "https://scholarworks.wmich.edu/math_pubs/40/",
      "s": "Pseudo-mathematics and financial charlatanism: the effects of backtest overfitting on out-of-sample performance"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Notices of the American Mathematical Society"
     },
     {
      "s": ", 61(5), 458-471."
     }
    ],
    [
     {
      "s": "Bernard, V. L. and Thomas, J. K. (1989). Post-earnings-announcement drift: delayed price response or risk premium? "
     },
     {
      "i": 1,
      "s": "Journal of Accounting Research"
     },
     {
      "s": ", 27 (Supplement)."
     }
    ],
    [
     {
      "s": "Black, F. (1975). Fact and fantasy in the use of options. "
     },
     {
      "i": 1,
      "s": "Financial Analysts Journal"
     },
     {
      "s": ", 31(4)."
     }
    ],
    [
     {
      "s": "Bryzgalova, S., Pavlova, A. and Sikorskaya, T. (2023). "
     },
     {
      "href": "https://lbsresearch.london.edu/id/eprint/2827",
      "s": "Retail trading in options and the rise of the big three wholesalers"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Journal of Finance"
     },
     {
      "s": ", 78(6), 3465-3514."
     }
    ],
    [
     {
      "s": "Cremers, M., Fodor, A., Muravyev, D. and Weinbaum, D. (2023). "
     },
     {
      "href": "https://ideas.repec.org/a/inm/ormnsc/v69y2023i8p4810-4827.html",
      "s": "Option trading activity, news releases, and stock return predictability"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Management Science"
     },
     {
      "s": ", 69(8), 4810-4827."
     }
    ],
    [
     {
      "s": "Easley, D., O'Hara, M. and Srinivas, P. S. (1998). "
     },
     {
      "href": "https://afajof.org/issue/volume-53-issue-2",
      "s": "Option volume and stock prices: evidence on where informed traders trade"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Journal of Finance"
     },
     {
      "s": ", 53(2), 431-465."
     }
    ],
    [
     {
      "s": "Garleanu, N., Pedersen, L. H. and Poteshman, A. M. (2009). "
     },
     {
      "href": "https://www.nber.org/papers/w11843",
      "s": "Demand-based option pricing"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Review of Financial Studies"
     },
     {
      "s": ", 22(10), 4259-4299."
     }
    ],
    [
     {
      "s": "Harvey, C. R., Liu, Y. and Zhu, H. (2016). "
     },
     {
      "href": "https://www.nber.org/papers/w20592",
      "s": "... and the cross-section of expected returns"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Review of Financial Studies"
     },
     {
      "s": ", 29(1), 5-68."
     }
    ],
    [
     {
      "s": "Johnson, T. L. and So, E. C. (2012). "
     },
     {
      "href": "https://ideas.repec.org/a/eee/jfinec/v106y2012i2p262-286.html",
      "s": "The option to stock volume ratio and future returns"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Journal of Financial Economics"
     },
     {
      "s": ", 106(2), 262-286."
     }
    ],
    [
     {
      "s": "Kunsch, H. R. (1989). "
     },
     {
      "href": "https://projecteuclid.org/euclid.aos/1176347265",
      "s": "The jackknife and the bootstrap for general stationary observations"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Annals of Statistics"
     },
     {
      "s": ", 17(3), 1217-1241."
     }
    ],
    [
     {
      "s": "Lee, C. M. C. and Ready, M. J. (1991). "
     },
     {
      "href": "https://ideas.repec.org/a/bla/jfinan/v46y1991i2p733-46.html",
      "s": "Inferring trade direction from intraday data"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Journal of Finance"
     },
     {
      "s": ", 46(2), 733-746."
     }
    ],
    [
     {
      "s": "Muravyev, D. (2016). "
     },
     {
      "href": "https://doi.org/10.1111/jofi.12380",
      "s": "Order flow and expected option returns"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Journal of Finance"
     },
     {
      "s": ", 71(2), 673-708."
     }
    ],
    [
     {
      "s": "Muravyev, D., Pearson, N. D. and Pollet, J. M. (2025). "
     },
     {
      "href": "https://ideas.repec.org/a/eee/jfinec/v172y2025ics0304405x25001618.html",
      "s": "Why does options market information predict stock returns?"
     },
     {
      "s": " "
     },
     {
      "i": 1,
      "s": "Journal of Financial Economics"
     },
     {
      "s": ", 172."
     }
    ],
    [
     {
      "s": "Ni, S. X., Pan, J. and Poteshman, A. M. (2008). "
     },
     {
      "href": "https://scholars.hkbu.edu.hk/en/publications/volatility-information-trading-in-the-option-market-3/",
      "s": "Volatility information trading in the option market"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Journal of Finance"
     },
     {
      "s": ", 63(3), 1059-1091."
     }
    ],
    [
     {
      "s": "Nosek, B. A., Ebersole, C. R., DeHaven, A. C. and Mellor, D. T. (2018). "
     },
     {
      "href": "https://doi.org/10.1073/pnas.1708274114",
      "s": "The preregistration revolution"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Proceedings of the National Academy of Sciences"
     },
     {
      "s": ", 115(11), 2600-2606."
     }
    ],
    [
     {
      "s": "OptionMetrics (2026). "
     },
     {
      "href": "https://www.webull.com/news/15667592405992448",
      "s": "IvyDB TradeFlow announcement"
     },
     {
      "s": ", syndicated press release, about 30 September 2026. Earlier product: "
     },
     {
      "href": "https://optionmetrics.com/news/optionmetrics-releases-signed-volume-2-0-with-insights-on-retail-participant-activity-and-even-more-detail-on-directional-buying-in-options-order-flows/",
      "s": "IvyDB Signed Volume 2.0"
     },
     {
      "s": "."
     }
    ],
    [
     {
      "s": "Pan, J. and Poteshman, A. M. (2006). "
     },
     {
      "href": "https://www.nber.org/papers/w10925",
      "s": "The information in option volume for future stock prices"
     },
     {
      "s": ". "
     },
     {
      "i": 1,
      "s": "Review of Financial Studies"
     },
     {
      "s": ", 19(3), 871-908."
     }
    ]
   ]
  },
  {
   "t": "p",
   "runs": [
    {
     "s": "The project's own record (rules files, scoring scripts and result files, each locked in a dated commit) is the source for every number in sections 3 to 7. No vendor data appears here: every number and figure is a summary I computed from it."
    }
   ]
  }
 ]
};
