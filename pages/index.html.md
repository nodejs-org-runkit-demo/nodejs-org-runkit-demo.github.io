---
component: main
title: RunKit Nodejs.org Redesign
---
<script src = "https://embed.runkit-demo.com"></script>

![RunKit Logo](/assets/images/logo.png)

Hi! We're [**RunKit**](https://runkit.com) and we've put together a couple ideas on how you might
use our [embed feature](https://runkit.com/docs/embed) in the node website
redesign initiative. We've created some prototypes so you can play around and get 
a better idea of what we've been thinking about. We're super passionate about **bringing documentation to life** and are really excited about these possibilities!

## Live Documentation - [Live Demo Link](/buffer)

Before diving into the dedicated "Getting Started" page, we wanted to share our
belief that *every* page has the opportunity to get a user experimenting with
node. Partially inspired by Josh Ashkanas' work on [Literate Programming](http://underscorejs.org/docs/underscore.html) as well
as Brett Victor's famous talks, we fundamentally believe that any "dead" snippet
of code is a lost opportunity. In this demo we've taken the existing markdown 
files that comprise the node documentation and made the substantial code samples
first class citizens – meant to be interacted with directly to really see if
one understands the concepts.

[![Live Documentation Concept](/assets/images/live-documentation.png "Every Page Can Be a Get Started Page")](/buffer)

## Getting Started - [Live Demo Link](/getting-started)

Our main goal with the "Getting Started" page we're presenting is that we try
to specifically focus on what differentiates Node from other platforms, that
way new users can quickly understand **why** they'd want to use Node instead
of merely **how** to use Node. Additionally, we try to paint Node in the broad
strokes it represents, offering explanations for its various use cases beyond
just serving webpages -- all this while still maintaining interactivity.

[![Getting Started Concept](/assets/images/getting-started.png "Dedicated Lessons That Focus on What Differentiates Node")](/getting-started)

## Who Uses RunKit?

These great sites have already integrated

- [NPM](http://npmjs.com)
- [Express](http://expressjs.com/en/starter/hello-world.html)
- [Lodash](https://lodash.com/docs/4.17.5)
- [Facebook Immutable](https://facebook.github.io/immutable-js/)
- [Ramda](http://ramdajs.com/docs/)
- [Font Awesome](https://fontawesome.com/how-to-use/use-with-node-js)
- [Stripe](http://stripe.com/)

## Why RunKit?

- We're here to help! And we enjoy it! Use cases like this are why we started this
project so we're super excited to contribute however we can, and assist in whatever
way is needed if you decide to use RunKit. It also goes without saying that this
service would be completely free.

- **module-fs** is by far our most important technology, as Node more than any other
platform is fundamentally a community effort through the amazing package ecosystem that
has built up around it. I think we should be highlighting this both for its technical merits
but also for its amazing accessibility.

- We are dedicated to supporting every major version of Node forever. One of our main
use cases is [filing bugs](https://blog.runkit.com/2017/02/01/stop-filing-bugs-file-a-container/),
and we thus consider it our responsibility to maintain the reproducibility of those bugs
forever. We'd love to discuss the possibility of supporting *nightly Node builds* in the docs as well.

- The code lives on your site! We hate the idea of the fundamental components of websites
being separated across privately administered databases. We want it to be easy to manage and
edit your code through your existing PR flow, and even to take your code somewhere else.

- RunKit is totally themable - pictured below is the custom theme Stripe uses on their home
page.

![Showing Stripe's Green Theme](/assets/images/stripe.png "RunKit is themable!")

- RunKit is **fast**. We completely re-architected our embeds to support hundreds of
simultaneously running examples on a page. We consider projects like the nodejs website
redesign to be our primary use case and have invested heavily in it.

- RunKit is a full member of TC39 and deeply interested in the future of JavaScript as a whole.

## Contact

The RunKit team is always happy to help, I've listed the members below:
<style>
    .pic
    {
        display: inline-block;
        background-size:cover;
        border-radius:50%;
        width:100px;
        height:100px;
    }
    
    a.pic { display: inline-block }
</style>
<center style = "margin:50px 0">
<a class = "pic" href = "mailto:francisco@runkit.com">
<div class = "pic" style = "background-image:url(https://runkit.com/assets/images/team/tolmasky.jpg);"></div>
Francisco
</a>
<a class = "pic" href = "mailto:pieter@runkit.com">
<div class = "pic" style = "background-image:url(https://runkit.com/assets/images/team/ouwerkerk.jpg);"></div>
Pieter
</a>
<a class = "pic" href = "mailto:randy@runkit.com">
<div class = "pic" style = "background-image:url(https://runkit.com/assets/images/team/me1000.jpg);"></div>
Randy
</a>
<a class = "pic" href = "mailto:maya@runkit.com">
<div class = "pic" style = "background-image:url(https://runkit.com/assets/images/team/maya.jpg);"></div>
Maya
</a>
<a class = "pic" href = "mailto:seandon@runkit.com">
<div class = "pic" style = "background-image:url(https://runkit.com/assets/images/team/seandon.jpg);"></div>
Seandon
</a>

</center>

Thanks for you time!
