# MMWS - MMWS Makes Websites Styled

## What is MMWS?

MMWS is a styling language you can use in websites, just like CSS. In fact, the language translates to CSS. Even though this reprository is by Chiroyce1, the language was made by [@mybearworld](https://scratch.mit.edu/users/mybearworld).

## Why MMWS?

MMWS is more consise than CSS, but still very readable. For example, say you wanted to style an HTML `<a>` attribute with the class `link`, but without the class `nostyle` in the color `#66f`, but when it's focused or hovered turns `#44d`. The way to do this in CSS would be:  
```css
a.link:not(.nostyle) {
    color: #66f;
}
a.link:not(.nostyle):focus, a.link:not(.nostyle):hover {
    color: #44d;
}
```
In MMWS, it is:  
```
:a + .link !(.nostyle)
    color #66f; hover #44d; focus
```
A lot more consise, but still readable, isn't it?

## How does MMWS work?
Look at the [documentation](https://scratch.mit.edu/discuss/post/6413069/) on Scratch!

## How do I code with MMWS?
Look on [this](https://scratch.mit.edu/discuss/post/6413065/) Scratch post for the way to use this in websites and a VSCode extension.

## I found a bug / want to suggest a feature!
Make sure you are logged in into your [Scratch account](https://scratch.mit.edu/join/), then post it [here](https://scratch.mit.edu/discuss/topic/614138/#reply)!
