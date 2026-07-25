# itch.io 上架资料（直接复制粘贴用）

## 上传步骤（网页，约 3 分钟）

1. itch.io 右上 **Upload new project**
2. **Title**：`Notebook War`
3. **Short description**（下面那栏，限 ~140 字）：见本文「Tagline」
4. **Classification**：`Games` → **Kind of project**：`HTML`
5. **Upload files** → 选 `notebook-war-itch.zip`（项目根目录下，69 KB）
   上传完勾选它下面的 **"This file will be played in the browser"**
6. **Embed options**：
   - Viewport dimensions：`1280` × `720`（已按这个尺寸验证过界面不裁切）
   - 勾选 **Fullscreen button**（战场越宽越好看）
   - 勾选 **Mobile friendly** → `Landscape` 提示
7. **Screenshots**：上传 `docs/battle.png`、`docs/coldwar.png`、`docs/nations.png`
   Cover image 用 `docs/battle.png`
8. **Genre**：`Simulation`；**Tags**：见下
9. Visibility 设 **Public** → **Save & view page**

zip 里有两个版本：`index.html`（1944 三国）是入口，标题旁的小链接可以跳到
`cold-war.html`（美苏冷战）。itch 的 iframe 里跳转正常。

---

## Tagline（Short description）

```
A war that fights itself, drawn in ballpoint on graph paper. WW2 or Cold War, two sides, no orders needed.
```

## Tags

```
wargame, simulation, sandbox, hand-drawn, idle, minimalist, ww2, cold-war, no-input, html5
```

## 页面正文（Description）

```
The war I used to draw in the margins of my school notebooks — rebuilt so that it fights itself.

Tanks and planes on both sides, pencil lines for tracer fire, a scribble over whatever got hit.
There were never any rules. I just wanted to watch the two sides go at each other, and I'd add
another tank whenever one side started losing.

So that's what this is. You don't command anyone. You draw units onto the paper and they fight on
their own — if you never touch it again, the battle still plays out.

WHAT'S IN IT

· Two eras. 1944 pits Wehrmacht, US Army and Red Army against each other — pick any two. The Cold
  War version is US vs USSR, with helicopters, drones and cruise missiles.
· 16 unit types with real equipment per nation. A Tiger, a Sherman and a T-34 are three different
  silhouettes, not three colours of the same box. Hover anything to read its designation.
· Weapons are separate things. A unit carries one or two and picks between them by expected damage:
  a tank uses its coaxial machine gun on infantry and saves the main gun for armour; a fighter
  falls back on wing guns in a turning fight because a missile has a minimum range.
· Suppression runs the infantry fight. Fire landing nearby pins men down whether or not it hits.
  Pinned infantry crawl for the nearest trench or bunker and stop advancing.
· Tanks throw a track and start smoking. Veterans earn stars and pull back sooner. Wounded units
  withdraw to regroup, and medics and supply trucks come forward to them.
· Six commander orders on cooldowns — air strike, barrage, reinforce, rally, smoke, airdrop — so
  you can lean on the battle without micromanaging it.

CONTROLS

Drag on the field to draw units · click an order then click the field to aim it · hover a unit for
its details · Space pauses · Tab switches which side your pen belongs to · Rotate button for phones.

No install, no accounts, no network calls. It's one HTML file.

Source (MIT): https://github.com/fong353/notebook-war
```

## 备选：用 butler 命令行上传

itch 官方 CLI，适合以后改一版就推一次。它要你自己的 API key，
在 https://itch.io/user/settings/api-keys 生成后按提示登录（不要把 key 贴给任何人）：

```bash
brew install butler
butler login
butler push notebook-war-itch.zip fong353/notebook-war:html5
```

之后每次更新只要重跑最后一行，itch 页面会自动换成新版本。
