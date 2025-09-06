import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { handleDeleteRoom } from "../utils/handleSocket";
import { useSocket } from "../contexts/SocketContext";
import { removeHyphen, toTitleCase, roomIdToNumber } from "../utils/helpers";
import type { Event, attackData, switchData } from "../types/data";

import bg1 from "../assets/bg_3.webp";
import bg2 from "../assets/bg_2.jpg";
import bg3 from "../assets/bg-snow.jpg";

import StatsCard from "../components/BattlePage/StatsCard";
import BattleActionsPanel from "../components/BattlePage/BattleActionsPanel";
import BattleDisplayPanel from "../components/BattlePage/BattleDisplayPanel";
import ActivePokeCount from "../components/BattlePage/ActivePokeCount";
import QuitBattleBox from "../components/BattlePage/QuitBattleBox";
import EndGameBox from "../components/BattlePage/EndGameBox";
import SelfSwitchAnimation from "../components/animations/SelfSwitchAnimation";
import OpponentSwitchAnimation from "../components/animations/OpponentSwitchAnimation";
import SelfAttackAnimation from "../components/animations/SelfAttackAnimation";
import OpponentAttackAnimation from "../components/animations/OpponentAttackAnimation";
import TakeDamageAnimation from "../components/animations/TakeDamageAnimation";
import FaintAnimation from "../components/animations/FaintAnimation";
import IntermediatePopUp from "../components/BattlePage/IntermediatePopUp";
import DisconnectPopUp from "../components/BattlePage/DisconnectPopUp";
import StatsCardAnimation from "../components/animations/StatsCardAnimation";

/**
 * Represents a move that a current pokemon can use.
 */
interface Move {
  name: string;
  type: string;
  pp: number;
  maxPP: number;
}

/**
 * Represents a pokemon in a Player's team.
 */
interface TeamMember {
  name: string;
  hp: number;
  maxHP: number;
  backSprite: string;
  frontSprite: string;
}

/**
 * Battle Screen for handling game play.
 */
export default function Battle() {
  const [actionMode, setActionMode] = useState<"none" | "attack" | "switch" | "faint">("none");
  const [status, setStatus] = useState<string | any>(); // Used for messages in display panel
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const [nextTeam, setNextTeam] = useState<TeamMember[]>([]);
  const [nextMoves, setNextMoves] = useState<Move[]>([]);

  const [selfCurrent, setSelfCurrent] = useState<TeamMember>({
    name: "",
    hp: 0,
    maxHP: 0,
    backSprite: "",
    frontSprite: "",
  });

  const [opponentCurrent, setOpponentCurrent] = useState<TeamMember>({
    name: "",
    hp: 0,
    maxHP: 0,
    backSprite: "",
    frontSprite: "",
  });

  const [selfPrevious, setSelfPrevious] = useState<TeamMember | null>(null);
  const [opponentPrevious, setOpponentPrevious] = useState<TeamMember | null>(null);
  const [selfTeamCount, setSelfTeamCount] = useState(0);
  const [selfRemaining, setSelfRemaining] = useState(0);
  const [opponentTeamCount, setOpponentTeamCount] = useState(0);
  const [opponentRemaining, setOpponentRemaining] = useState(0);
  const [selfIsSummoned, setSelfIsSummoned] = useState(false);
  const [opponentIsSummoned, setOpponentisSummoned] = useState(false);
  const [eventQueue, setEventQueue] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const isAnimating = currentEvent !== null;
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [winningTeam, setWinningTeam] = useState<string[]>([]);
  const [winnerName, setWinnerName] = useState("");
  const [battleStarted, setBattleStarted] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);
  const [showDisconnectPopup, setDisconnectPopUp] = useState(false);
  const [disconnectMessage, setDisconnectMessage] = useState("");
  const [waitForFaintedSwitch, setWaitForFaintedSwitch] = useState(false);

  const bgImages = [bg1, bg2, bg3];

  const navigate = useNavigate();
  const socket = useSocket();
  const { roomId } = useParams();
  const location = useLocation();
  const mode = (location.state as { mode?: "singleplayer" | "multiplayer" } | undefined)?.mode ?? "singleplayer";
  const [isMultiplayer, setIsMultiplayer] = useState(mode === "multiplayer");
  const [waitingMessage, setWaitingMessage] = useState<string | null>(
    mode === "multiplayer" ? "Waiting for opponent to join..." : null
  );
  const battleBg = bgImages[roomIdToNumber(roomId)];

  useEffect(() => {
    function onGameStart(data: any) {
      const { events } = data;
      console.log("gameStart", events);

      const delay = isMultiplayer ? 3000 : 0;
      if (isMultiplayer) setWaitingMessage("Loading Battle...");

      const battleStartSequence = () => {
        setEventQueue(events);
        setBattleStarted(true);
        setWaitingMessage(null);
        loadingTimeoutRef.current = null;
      };

      if (delay > 0) {
        loadingTimeoutRef.current = window.setTimeout(battleStartSequence, delay);
      } else {
        battleStartSequence();
      }
    }

    function onWaitingForPlayer() {
      if (!isMultiplayer) setIsMultiplayer(true);
      if (!battleStarted) setWaitingMessage("Waiting for opponent to join...");
    }

    function onCurrentState(data: any) {
      console.log("currentState:", data);

      const selfData = data.self;
      const opponentData = data.opponent;

      setSelfTeamCount(selfData.teamCount);
      setSelfRemaining(selfData.remainingPokemon);

      setOpponentTeamCount(opponentData.teamCount);
      setOpponentRemaining(opponentData.remainingPokemon);

      setSelfPrevious(selfCurrent);
      setSelfCurrent({
        name: selfData.name,
        hp: selfData.hp,
        maxHP: selfData.maxHP,
        backSprite: selfData.backSprite,
        frontSprite: selfData.frontSprite,
      });

      setOpponentPrevious(opponentCurrent);
      setOpponentCurrent({
        name: opponentData.name,
        hp: opponentData.hp,
        maxHP: opponentData.maxHP,
        backSprite: opponentData.backSprite,
        frontSprite: opponentData.frontSprite,
      });
    }

    /**
     * Handles nextOptions event from server to update player and opponent data.
     * @param data containing team and move information
     */
    function onNextOptions(data: any) {
      console.log("nextOptions:", data);
      // parsing self data
      const nextMoves: Move[] = data.moves.map((moveData: any) => ({
        name: moveData.name,
        type: moveData.type,
        pp: moveData.pp,
        maxPP: moveData.maxPP,
      }));

      const nextTeam: TeamMember[] = data.pokemon.map((pokemon: any) => ({
        name: pokemon.name,
        hp: pokemon.hp,
        maxHP: pokemon.maxHP,
        frontSprite: pokemon.sprite,
        isCurrent: pokemon.isCurrent,
      }));
      setNextTeam(nextTeam);
      setNextMoves(nextMoves);
    }

    /**
     * Handles turnSummary event from server to display and update turn results.
     * @param summary array of turn event messages from the server
     */
    function onTurnSummary(events: any[]) {
      console.log("turnSummary", events);
      setEventQueue((prevEvents) => [...prevEvents, ...events]);
      setWaitForFaintedSwitch(false);
    }

    function onRequestFaintedSwitch() {
      setEventQueue((events) => [
        ...events,
        {
          user: "self", // "self" | "opponent"
          animation: "none", // "attack" | "switch" | "status" | "faint" | "none"
          message: "Your Pokemon has fainted! Switch to another Pokemon",
          attackData: {} as attackData,
          switchData: {} as switchData,
          onComplete: () => {
            setSelfPrevious(null);
            setSelfCurrent({
              name: selfCurrent.name,
              hp: selfCurrent.hp,
              maxHP: selfCurrent.maxHP,
              backSprite: "",
              frontSprite: "",
            });
            setActionMode("faint");
          },
        },
      ]);
    }

    function onWaitForFaintedSwitch(data: any) {
      setEventQueue((events) => [
        ...events,
        {
          user: "opponent", // "self" | "opponent"
          animation: "none", // "attack" | "switch" | "status" | "faint" | "none"
          message: "The opponent's Pokemon has fainted! Wait for their next Pokemon!",
          attackData: {} as attackData,
          switchData: {} as switchData,
          onComplete: () => {
            setOpponentPrevious(null);
            setOpponentCurrent({
              name: opponentCurrent.name,
              hp: 0,
              maxHP: opponentCurrent.maxHP,
              backSprite: "",
              frontSprite: "",
            });
            setStatus(data.message);
            mode === "multiplayer" ? setWaitForFaintedSwitch(true) : setWaitForFaintedSwitch(false);
          },
        },
      ]);
    }

    /**
     * Handles endGame event from the server if one player disconnects.
     * @param data containing the game over message
     */
    function onEndGame(data: any) {
      setDisconnectMessage(data.message);
      setDisconnectPopUp(true);
    }

    function onGameOver({ message, team }: any) {
      setEventQueue((events) => [
        ...events,
        {
          user: "self", // "self" | "opponent"
          animation: "none", // "attack" | "switch" | "status" | "faint" | "none"
          message: "Game Over!",
          attackData: {} as attackData,
          switchData: {} as switchData,
          onComplete: () => {
            setGameOverMessage(message);
            setWinningTeam(team);
            const winner = message.split(" ")[0];
            setWinnerName(winner);
            setIsGameOver(true);
          },
        },
      ]);
    }

    socket.on("waitingForPlayer", onWaitingForPlayer);
    socket.on("gameStart", onGameStart);
    socket.on("currentState", onCurrentState);
    socket.on("turnSummary", onTurnSummary);
    socket.on("nextOptions", onNextOptions);
    socket.on("requestFaintedSwitch", onRequestFaintedSwitch);
    socket.on("waitForFaintedSwitch", onWaitForFaintedSwitch);
    socket.on("endGame", onEndGame);
    socket.on("gameOver", onGameOver);

    return () => {
      socket.off("waitingForPlayer", onWaitingForPlayer);
      socket.off("gameStart", onGameStart);
      socket.off("currentState", onCurrentState);
      socket.off("nextOptions", onNextOptions);
      socket.off("turnSummary", onTurnSummary);
      socket.off("requestFaintedSwitch", onRequestFaintedSwitch);
      socket.off("waitForFaintedSwitch", onWaitForFaintedSwitch);
      socket.off("endGame", onEndGame);
      socket.off("gameOver", onGameOver);
    };
  }, [socket, navigate, selfCurrent, opponentCurrent]);

  useEffect(() => {
    if (!currentEvent && eventQueue.length > 0) {
      const nextEvent = eventQueue[0];
      setCurrentEvent(nextEvent);
      setEventQueue((prev) => prev.slice(1));
      setStatus(nextEvent.message);

      if (nextEvent.animation === "none") {
        setTimeout(() => {
          setCurrentEvent(null);
          nextEvent.onComplete?.();
        }, 1000);
      } else if (nextEvent.animation === "switch") {
        const newPokemonData = {
          name: nextEvent.switchData.name,
          hp: nextEvent.switchData.hp,
          maxHP: nextEvent.switchData.maxHP,
          backSprite: nextEvent.switchData.backSprite,
          frontSprite: nextEvent.switchData.frontSprite,
        };

        nextEvent.user === "self" ? setSelfCurrent(newPokemonData) : setOpponentCurrent(newPokemonData);
      } else if (nextEvent.animation === "attack") {
        if (nextEvent.user === "self") {
          setOpponentCurrent((prev) => {
            return { ...prev, hp: nextEvent.attackData.newHP };
          });
        } else {
          setSelfCurrent((prev) => {
            return { ...prev, hp: nextEvent.attackData.newHP };
          });
        }
      }
    }

    if (battleStarted && !currentEvent && eventQueue.length === 0) {
      setStatus("Select your next move...");
      socket.emit("requestState");
    }
  }, [eventQueue, currentEvent, battleStarted, socket]);

  //Functions to handle quitting the battle
  const handleQuit = () => setShowQuitConfirm(true);
  const confirmQuit = () => {
    socket.emit("quitGame"), handleDeleteRoom(roomId);
    navigate("/");
  };
  const cancelQuit = () => setShowQuitConfirm(false);

  return isGameOver && !isAnimating ? (
    <EndGameBox
      message={gameOverMessage}
      team={winningTeam}
      playerName={winnerName}
      background={battleBg}
      onClose={() => navigate("/")}
    />
  ) : (
    <div className="relative w-screen h-screen overflow-hidden grid grid-rows-[1fr_4fr_1fr] text-gray-700">
      {/* Background */}
      <img
        src={battleBg}
        className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
        alt="Battle Background"
      />

      {/* Intermediate Page */}
      {!battleStarted && mode === "multiplayer" && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60">
          <IntermediatePopUp
            isVisible={true}
            message={waitingMessage}
            onClick={() => {
              socket.emit("quitGame"), handleDeleteRoom(roomId), navigate("/");
            }}
          />
        </div>
      )}

      {/* Top Section */}
      <div className="flex w-5/20 h-full justify-bottom items-end px-6 pt-6 z-100">
        {/* Opponent Pokemon Card */}
        {currentEvent?.user === "opponent" && currentEvent.animation === "switch" ? (
          <StatsCard
            name={removeHyphen(opponentCurrent.name) || "Loading..."}
            image={opponentCurrent.frontSprite}
            hp={opponentCurrent.hp || 0}
            maxHP={opponentCurrent.maxHP}
          />
        ) : (
          <StatsCardAnimation
            name={removeHyphen(opponentCurrent.name) || "Loading..."}
            image={opponentCurrent.frontSprite}
            hp={opponentCurrent.hp || 0}
            maxHP={opponentCurrent.maxHP}
          />
        )}
      </div>

      {/* Middle Section Player Pokémon */}
      <div className="flex flex-1 justify-between px-6">
        <div className="flex flex-col justify-between w-1/2">
          <div className="flex justify-start">
            {/* Opponent Active Pokemon Count */}
            <ActivePokeCount teamCount={opponentTeamCount} remainingPokemon={opponentRemaining} />
          </div>
          {/* Player Pokémon */}
          <div className="flex justify-center items-baseline-last">
            {currentEvent?.user === "self" && currentEvent.animation === "switch" ? (
              <SelfSwitchAnimation
                prevPokemon={selfPrevious?.backSprite ?? ""}
                newPokemon={selfCurrent.backSprite}
                onComplete={() => {
                  setSelfIsSummoned(true);
                  setCurrentEvent(null);
                }}
              />
            ) : currentEvent?.user === "self" && currentEvent.animation === "attack" ? (
              <SelfAttackAnimation pokemon={selfCurrent.backSprite} onComplete={() => setCurrentEvent(null)} />
            ) : currentEvent?.user === "opponent" && currentEvent.animation === "attack" ? (
              <TakeDamageAnimation user="self" pokemon={selfCurrent.backSprite} />
            ) : currentEvent?.user === "self" && currentEvent.animation === "faint" ? (
              <FaintAnimation
                user="self"
                pokemon={selfCurrent.backSprite}
                onComplete={() => {
                  setSelfIsSummoned(false);
                  setCurrentEvent(null);
                }}
              />
            ) : selfIsSummoned ? (
              <img
                className="w-3/4 h-auto select-none pointer-events-none"
                src={selfCurrent.backSprite}
                alt={selfCurrent.name}
              />
            ) : null}
          </div>
        </div>
        {/* Opponent Pokémon */}
        <div className="flex flex-col justify-between w-1/2">
          <div className="flex justify-center items-baseline px-6">
            {currentEvent?.user === "opponent" && currentEvent.animation === "switch" ? (
              <OpponentSwitchAnimation
                prevPokemon={opponentPrevious?.frontSprite ?? ""}
                newPokemon={opponentCurrent.frontSprite}
                onComplete={() => {
                  setOpponentisSummoned(true);
                  setCurrentEvent(null);
                }}
              />
            ) : currentEvent?.user === "opponent" && currentEvent.animation === "attack" ? (
              <OpponentAttackAnimation pokemon={opponentCurrent.frontSprite} onComplete={() => setCurrentEvent(null)} />
            ) : currentEvent?.user === "self" && currentEvent.animation === "attack" ? (
              <TakeDamageAnimation user="opponent" pokemon={opponentCurrent.frontSprite} />
            ) : currentEvent?.user === "opponent" && currentEvent.animation === "faint" ? (
              <FaintAnimation
                user="opponent"
                pokemon={opponentCurrent.frontSprite ?? ""}
                onComplete={() => {
                  setOpponentisSummoned(false);
                  setCurrentEvent(null);
                }}
              />
            ) : opponentIsSummoned ? (
              <img
                className="w-2/4 h-auto select-none pointer-events-none"
                src={opponentCurrent.frontSprite}
                alt={opponentCurrent.name}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Section (Controls + Player Stats) */}
      <div className="sticky bottom-0 flex flex-col z-100">
        <div className="flex justify-end px-6">
          <ActivePokeCount teamCount={selfTeamCount} remainingPokemon={selfRemaining} />
        </div>
        <div className=" flex flex-row px-6 pb-6 gap-4">
          {/* Battle Display and Action Panel */}
          <div className="flex w-15/20 justify-center items-baseline-last">
            <BattleDisplayPanel
              mode={actionMode}
              moves={nextMoves}
              team={nextTeam}
              status={status}
              currentPokemon={removeHyphen(selfCurrent.name)}
              onMoveSelect={(index) => {
                console.log("Selected move:", index);
                setStatus(`You selected ${toTitleCase(removeHyphen(nextMoves[index].name))}\nWaiting for opponent...`);
                setActionMode("none");
                socket.emit("submitMove", { action: "attack", index: index });
              }}
              onSwitchSelect={(index) => {
                // console.log("Selected switch with index:", index);
                const selectedName = nextTeam[index].name;
                setStatus(`You switched to ${selectedName}\nWaiting for opponent...`);

                if (actionMode === "faint") {
                  socket.emit("submitFaintedSwitch", { action: "switch", index: index });
                } else {
                  socket.emit("submitMove", { action: "switch", index: index });
                }

                setActionMode("none");
              }}
            />
          </div>

          {/* Action Button Panel */}
          <div className="flex w-1/8 h-full justify-center items-baseline-last">
            <BattleActionsPanel
              onSelect={(mode) => setActionMode(mode)}
              onQuit={handleQuit}
              isFainted={selfCurrent.hp === 0}
              disabled={isAnimating || waitForFaintedSwitch}
            />
          </div>

          {/* Player Stats*/}
          <div className="flex w-5/20 justify-bottom items-end">
            <StatsCardAnimation
              key={selfCurrent.name} // re-render
              name={removeHyphen(selfCurrent.name) || "Loading..."}
              image={selfCurrent.frontSprite}
              hp={actionMode === "faint" ? 0 : selfCurrent.hp}
              maxHP={selfCurrent.maxHP}
            />
          </div>
        </div>
      </div>

      {/* Quit Message */}
      {showQuitConfirm && <QuitBattleBox onConfirm={confirmQuit} onCancel={cancelQuit} />}
      {showDisconnectPopup && (
        <DisconnectPopUp
          onExit={() => {
            setDisconnectPopUp(false);
            navigate("/");
          }}
          message={disconnectMessage}
        />
      )}
    </div>
  );
}
