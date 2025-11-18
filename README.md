# DND journal project

Just a personal project. The idea came from a member of our DND group wants to journal everything we do.

I thought it'd be nice to have a place online for them to submit to and for the group to see it whenever.

It'll be nice for the DM to prep stuff and revisit old memories.

## Pages Overview:

| Path                  | Page              |
| --------------------- | ----------------- | 
| `"/"`                 | Home Page         | 
| `"/character"`        | Characters Page   | 
| `"/character:charId"` | Character Page    | 
| `"/campaign"`         | Campaigns Page    | 
| `"/campaign:campId"`  | Campaign Page     |
| `"/login"`            | Login Page        |
| `"/signup"`           | Sign-up Page      | 
| `"/profile"`          | Signed-in Page    | 
| `"/profile/:charId"`  | Edit Character Page  |
| `"/profile/:campId"`  | Edit Campaign Page |

---


## Pages Features:

**1. Home Page**

Generic landing page. Tabs for character page, campaign page, and login.

**2. Character Page**

Lists all characters

**2A. Individual character page**

Shows their name, story, notable quotes and pictures.

Author, created Date and edit date are also listed.

**3. Campaign Page**

Lists all campaigns

**3A. Individual Campaign page**

Shows title, summary, pictures and a prequel&sequel

Author, created date and edit date are also shown too.

**4. Dice Roller**

Digital dice roller with all dice types and history log.



## MongoDB Backend Collection:

**user document**
```
{
    _id: uuid v4 (UserId),
    username: string,
    passwprd: string,
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
    quotes: string,
    pictures: string,
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
    pictures: string,
    prequelCampaign: CampaignId,
    sequelCampaign: CampaignId,
}
```

## Backend operations:
```
- Post user (signup)
- Get user (login)

- Create character
- Get character
- Update character (Edit character)
- Delete character

- Create campaign
- Get campaign
- Update campaign (Edit campaign) 
- Delete campaign
```