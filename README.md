# NonCal

A tiny Javascript library for creating "Add to Calendar" buttons for your upcoming events.

This is a rewrite of Carl Sednaoui's OuiCal with added Outlook Web calendar.

## How to use it?

        <div id="some-id"></div>

        <script>

            var event = {
                title:       'Get on the front page of HN',
                start:       new Date('June 15, 2020 19:00'),   // see Date, other formats are supported
                duration:    120,                               // in minutes
                end:         new Date('June 16, 2020 23:00'),   // overrides duration if set
                location:    'The internet',
                description: 'Get on the front page of HN, then prepare for world domination.'
            };

            addToCalendarButton(event, 'some-id');

        </script>

## Licence
[MIT](http://opensource.org/licenses/MIT)
