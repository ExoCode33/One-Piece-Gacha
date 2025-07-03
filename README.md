# One Piece Devil Fruit Gacha Bot

A Discord bot that lets users hunt for Devil Fruits from the One Piece universe with cinematic animations and a comprehensive collection system.

## Features

### 🍈 Devil Fruit Hunting
- **Single Hunt**: Pull one Devil Fruit with full cinematic animation
- **Multi Hunt**: Pull 10 Devil Fruits at once (coming soon)
- **Premium Hunt**: Enhanced rates and exclusive content (coming soon)

### 🎮 Rarity System
- **⬜ Common** (45%): Basic utility fruits
- **🟩 Uncommon** (30%): Decent combat fruits
- **🟦 Rare** (18%): Strong combat fruits and basic Logia
- **🟨 Legendary** (5.5%): Admiral-level fruits and elite powers
- **🟥 Mythical** (1.3%): World-changing fruits like Gura Gura no Mi
- **🌈 Omnipotent** (0.2%): Reality-bending fruits like Nika

### 🔧 Admin Features
- Debug mode for testing animations
- Force specific rarities for testing
- Status monitoring and controls

## Commands

### `/pull [type]`
Hunt for Devil Fruits in the Grand Line!
- `single`: Single hunt with 5s cooldown
- `multi`: 10x hunt with 30s cooldown (coming soon)
- `premium`: Premium hunt with better rates (coming soon)

### `/gacha-admin debug <mode> [rarity]`
Devil Fruit Gacha admin controls for testing and debugging
- `mode`: enable/disable/status
- `rarity`: Force specific rarity (common/uncommon/rare/legendary/mythical/omnipotent/off)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your Discord bot token and client ID:
   ```
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   ```

3. **Start the Bot**
   ```bash
   npm start
   ```

## File Structure

```
One-Piece-Gacha-main/
├── src/
│   ├── animations/
│   │   ├── engine.js      # Animation engine and debug system
│   │   ├── gacha.js       # Main cinematic experience
│   │   ├── indicators.js  # Progressive hint system
│   │   └── particles.js   # One Piece themed particle effects
│   ├── commands/
│   │   ├── admin.js       # Admin debug commands
│   │   └── pull.js        # Main pull command
│   ├── data/
│   │   └── devilfruit.js  # Complete Devil Fruit database
│   └── events/
│       └── interactionCreate.js  # Event handler
├── config/
│   └── bot.js            # Bot configuration
├── index.js              # Main bot file
└── package.json          # Dependencies
```

## Debug Mode

Enable debug mode to test animations and specific rarities:

```
/gacha-admin debug enable
/gacha-admin debug enable rarity:legendary
```

This will:
- Force all pulls to be legendary rarity
- Show debug logging in console
- Allow testing of animations for specific rarities

## Devil Fruit Database

The bot includes 50+ Devil Fruits from the One Piece universe:
- **Logia**: Mera Mera no Mi, Hie Hie no Mi, Pika Pika no Mi, etc.
- **Paramecia**: Gura Gura no Mi, Ope Ope no Mi, Nikyu Nikyu no Mi, etc.
- **Zoan**: Hito Hito no Mi Model: Nika, Uo Uo no Mi Model: Seiryu, etc.
- **Ancient Zoan**: Ryu Ryu no Mi variants
- **Mythical Zoan**: Phoenix, Dragon, Buddha, etc.

Each fruit includes:
- Power descriptions
- Previous users
- Awakening abilities
- Weaknesses
- Power levels
- Rarity classifications

## Animation System

The bot features a progressive animation system:
1. **Initial Hunt**: Sets the scene
2. **Scanning Phase**: 8 animated frames with changing indicators
3. **Energy Building**: Progressive energy bars
4. **Final Reveal**: Cinematic fruit revelation with full details

## Cooldown System

- **Single Hunt**: 5 seconds
- **Multi Hunt**: 30 seconds
- **Premium Hunt**: 60 seconds

## Collection System

Users can:
- View their collection with `/pull` → "My Collection" button
- Track rarity statistics
- See discovery rates
- Share their legendary finds

## Troubleshooting

### Bot Not Responding
- Check your Discord token is valid
- Ensure the bot has proper permissions in your server
- Verify all dependencies are installed

### Animation Errors
- Check console for error messages
- Ensure all animation files are present
- Try debug mode to isolate issues

### Command Registration Issues
- Commands are auto-registered on bot startup
- May take a few minutes to appear in Discord
- Check console for registration success messages

## Contributing

The bot is designed to be easily extensible:
- Add new Devil Fruits to `src/data/devilfruit.js`
- Modify animation timing in `src/animations/engine.js`
- Add new particle effects in `src/animations/particles.js`
- Extend the admin system in `src/commands/admin.js`

## License

This bot is for educational and entertainment purposes. One Piece and all related characters are property of Eiichiro Oda and Toei Animation.
