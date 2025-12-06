# DND journal project

Just a personal project. The idea came from a member of our family DND group, who wanted to journal everything we do.

I thought it'd be nice to have a place online for them to submit to and for the group to see it whenever.

It'll be nice for the DM to prep stuff and revisit old memories.

Deployed link: https://dungeonnotesdatabase.vercel.app/

## Pages Overview:

| Path                  | Page              |
| --------------------- | ----------------- | 
| `"/"`                 | Home Page         | 
| `"/character"`        | Characters Page   | 
| `"/character:charId"` | Character Page    | 
| `"/campaign"`         | Campaigns Page    | 
| `"/campaign:campId"`  | Campaign Page     |
| `"/manage"`           | Manage Page        |
| `"/manage/character/new"` | Create New Character      | 
| `"/manage/character/:charId"` | Edit Character     |
| `"/manage/campaign/new"` | Create New Campaign     |  
| `"/manage/campaign/:campId"` | Edit Campaign      | 
| `"/login"`          | Sign-in/up Page    | 
| `"/diceroller"`  | Fun dice roller |


---


## Pages Features:

**1. Home Page**

Main landing page. Contains small description of website and main navigation buttons.

**2. Character Page**

Shows the Character name, their background story, popular quotes,created date and last edit date.

**3. Campaign Page**

Similar to character page, lists campaign name, the campaign story, created date, author and last edit date.

**4. Character/Campaign Lists**

Shows a list of all the characters or campaigns. List may be sorted by character name, author or created date.

**5. Manage character/campaign**

Only the user's characters/campaign may be edit their own files. Up to 8 quotes can be added and removed. Data may also be deleted after confirmation.

**6. Dice Roller**

Just a fun little dice roller. Different die sizes may be selected. The last 6 results are shown and high and low values have their own text. Audio and confetti can be toggled.

## Extra implementations:

For password safety, I included salt and hashing.

For confirmations and errors, I've included toasts for UI/UX.

Created simple figma animation for loading.

## MongoDB Backend Collection:

**user document**
```
{
    _id: uuid v4 (UserId),
    username: string,
    passwprd: hashed string,
}
```

**character document**
```
{
    _id: uuid v4 (HeroId),
    author: UserId,
    createdAt: Date,
    lastEdit: Date,
    name: string,
    story: string,
    quotes: array,
    pictures: string, (To be implemented later)
}
```

**campaign document**
```
{
    _id: uuid v4 (CampaignId),
    author: UserId,
    createdAt: Date,
    lastEdit: Date,
    title: string,
    story: string,
    pictures: string, (To be implemented later)
    prequelCampaign: CampaignId,  (To be implemented later)
    sequelCampaign: CampaignId,  (To be implemented later)
}
```

## Backend operations:
```
- Post user (signup)
- Get user (login)
- Get characters
- Get campaigns
- Get character
- Get campaign

- Create character
- Update character (Edit character)
- Delete character

- Create campaign
- Update campaign (Edit campaign) 
- Delete campaign
```

## Required addons:

**Front End**

all general react dependencies, sonner, canvas-confetti, styled-components

**Back End**

bcrypt, dotenv, express, mongodb, nodemon, uuid