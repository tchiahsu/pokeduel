import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSocket } from "../contexts/SocketContext";

import battleBg from "../assets/bg_3.webp";
import StatsCard from "../components/BattlePage/StatsCard";
import BattleActionsPanel from "../components/BattlePage/BattleActionsPanel";
import BattleDisplayPanel from "../components/BattlePage/BattleDisplayPanel";
import ActivePokeCount from "../components/BattlePage/ActivePokeCount";
import QuitBattleBox from "../components/BattlePage/QuitBattleBox";
import SelfSwitchAnimation from "../components/animations/SelfSwitchAnimation";
import OpponentSwitchAnimation from "../components/animations/OpponentSwitchAnimation";
import SelfAttackAnimation from "../components/animations/SelfAttackAnimation";
import OpponentAttackAnimation from "../components/animations/OpponentAttackAnimation";
import TakeDamageAnimation from "../components/animations/TakeDamageAnimation";

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

/*
 * A type representing an event in the battle (attack, switch, faint, or status effect).
 * Used to animate battle actions and display messages to the players.
 */
type Event = {
  user: string; // "self" | "opponent"
  animation: string; // "attack" | "switch" | "status" | "faint" | "none"
  message: string;
  type: string;
  image: string;
  name: string;
};

/**
 * Battle Screen for handling game play.
 */
export default function Battle() {
  const [mode, setMode] = useState<"none" | "attack" | "switch" | "fainted">("none");
  const [status, setStatus] = useState<string | any>("Select an action to begin..."); // Used for messages in display panel
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const [selfTeam, setSelfTeam] = useState<TeamMember[]>([]);
  const [selfMoves, setSelfMoves] = useState<Move[]>([]);

  const [selfActive, setSelfActive] = useState<TeamMember>({
    name: "",
    hp: 0,
    maxHP: 100,
    backSprite: "",
    frontSprite: "",
  });

  const [opponentActive, setOpponentActive] = useState<TeamMember>({
    name: "",
    hp: 0,
    maxHP: 100,
    backSprite: "",
    frontSprite: "",
  });

  const [selfTeamCount, setSelfTeamCount] = useState(0);
  const [selfRemaining, setSelfRemaining] = useState(0);
  const [opponentTeamCount, setOpponentTeamCount] = useState(0);
  const [opponentRemaining, setOpponentRemaining] = useState(0);
  const [selfIsSummoned, setSelfIsSummoned] = useState(false);
  const [opponentIsSummoned, setOpponentisSummoned] = useState(false);

  const [eventQueue, setEventQueue] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    function onGameStart(events: any) {
      setEventQueue(events);
    }

    function onCurrentState(data: any) {
      console.log("currentState:", data);

      const selfData = data.self;
      const opponentData = data.opponent;

      setSelfTeamCount(selfData.teamCount);
      setSelfRemaining(selfData.remainingPokemon);

      setOpponentTeamCount(opponentData.teamCount);
      setOpponentRemaining(opponentData.remainingPokemon);

      setSelfActive({
        name: selfData.name,
        hp: selfData.hp,
        maxHP: selfData.maxHP,
        backSprite: selfData.backSprite,
        frontSprite: selfData.frontSprite,
      });

      setOpponentActive({
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
      const parsedMoves: Move[] = data.moves.map((moveObj: any) => ({
        name: moveObj.name,
        type: moveObj.type,
        pp: moveObj.pp,
        maxPP: moveObj.maxPP,
      }));

      const parsedTeam: TeamMember[] = data.pokemon.map((poke: any) => ({
        name: poke.name,
        hp: poke.hp,
        maxHP: poke.maxHP || 100,
        frontSprite: poke.sprite,
        isCurrent: poke.isCurrent,
      }));
      setSelfTeam(parsedTeam);
      setSelfMoves(parsedMoves);
    }

    /**
     * Handles turnSummary event from server to display and update turn results.
     * @param summary array of turn event messages from the server
     */
    function onTurnSummary(events: any[]) {
      setEventQueue(events);
    }

    // function onRequestFaintedSwitch(data: any) {
    //   console.log("requestFaintedSwitch:", data);
    //   setStatus("Your Pokemon has fainted! Switch to another Pokemon");
    //   setMode("fainted");

    //   const parsedTeam: TeamMember[] = data.map((poke: any) => ({
    //     name: poke.name,
    //     hp: poke.hp,
    //     maxHP: poke.maxHP || 100,
    //     image: poke.sprite,
    //   }));
    //   setSelfTeam(parsedTeam);

    //   const fainted = parsedTeam.find((p) => p.name === selfActive.name);
    //   if (fainted) {
    //     setSelfActive({
    //       name: fainted.name,
    //       hp: 0,
    //       maxHP: fainted.maxHP,
    //       image: fainted.image,
    //     });
    //   }
    // }

    /**
     * Handles endGame event from the server.
     * @param data containing the game over message
     */
    function onEndGame(data: any) {
      alert(data.message);
      navigate("/"); // to be changed to a pop-up that navigates to summary page
    }

    socket.on("gameStart", onGameStart);
    socket.on("currentState", onCurrentState);
    socket.on("turnSummary", onTurnSummary);
    socket.on("nextOptions", onNextOptions);
    // socket.on("requestFaintedSwitch", onRequestFaintedSwitch);
    socket.on("waitForFaintedSwitch", (data: any) => {
      setStatus(data.message || "Waiting for other player to switch pokemon");
    });
    socket.on("endGame", onEndGame);

    return () => {
      socket.off("gameStart", onGameStart);
      socket.off("currentState", onCurrentState);
      socket.off("nextOptions", onNextOptions);
      socket.off("turnSummary", onTurnSummary);
      // socket.off("requestFaintedSwitch", onRequestFaintedSwitch);
      socket.off("waitForFaintedSwitch");
      socket.off("endGame", onEndGame);
    };
  }, [socket, navigate, selfActive.name]);

  useEffect(() => {
    if (!currentEvent && eventQueue.length > 0) {
      setCurrentEvent(eventQueue[0]);
      setEventQueue((prev) => prev.slice(1));
      setStatus(eventQueue[0].message);

      if (eventQueue[0].animation === "none") {
        setTimeout(() => {
          setCurrentEvent(null);
        }, 1000);
      }
    }
  }, [eventQueue, currentEvent]);

  //Functions to handle quitting the battle
  const handleQuit = () => setShowQuitConfirm(true);
  const confirmQuit = () => navigate("/");
  const cancelQuit = () => setShowQuitConfirm(false);

  return (

    <div className="relative w-screen h-screen overflow-hidden grid grid-rows-[1fr_4fr_1fr]">

      {/* Background */}
      <img
        src={battleBg}
        className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
        alt="Battle Background"
      />

      {/* Top Section */}
      <div className="flex w-5/20 justify-bottom items-end px-6 pt-6 z-100">
        {/* Opponent Pokemon Card */}
        <StatsCard
          name={opponentActive.name || "Loading.."}
          image={opponentActive.frontSprite}
          hp={opponentActive.hp || 0}
          maxHP={opponentActive.maxHP || 100}
        />
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
            {/* {selfActive.backSprite && (
              <img
                className="absolute w-200 h-150 select-none pointer-events-none"
                src={selfActive.backSprite}
                alt={selfActive.name}
              />
            )} */}
            {currentEvent?.user === "self" && currentEvent.animation === "switch" ? (
              <SelfSwitchAnimation
                pokemon={selfActive.backSprite}
                onComplete={() => {
                  setSelfIsSummoned(true);
                  setCurrentEvent(null);
                }}
              />
            ) : currentEvent?.user === "self" && currentEvent.animation === "attack" ? (
              <SelfAttackAnimation pokemon={selfActive.backSprite} onComplete={() => setCurrentEvent(null)} />
            ) : currentEvent?.user === "opponent" && currentEvent.animation === "attack" ? (
              <TakeDamageAnimation pokemon={selfActive.backSprite} />
            ) : selfIsSummoned ? (
              <img
                className="w-3/4 h-auto select-none pointer-events-none"
                src={selfActive.backSprite}
                alt={selfActive.name}
              />
            ) : null}
          </div>
        </div>
        {/* Opponent Pokémon */}
        <div className="flex flex-col justify-between w-1/2">
          <div className="flex justify-center items-baseline px-6">
            {currentEvent?.user === "opponent" && currentEvent.animation === "switch" ? (
              <OpponentSwitchAnimation pokemon={opponentActive.frontSprite} onComplete={() => setCurrentEvent(null)} />
            ) : currentEvent?.user === "opponent" && currentEvent.animation === "attack" ? (
              <OpponentAttackAnimation pokemon={opponentActive.frontSprite} onComplete={() => setCurrentEvent(null)} />
            ) : currentEvent?.user === "self" && currentEvent.animation === "attack" ? (
              <TakeDamageAnimation pokemon={opponentActive.frontSprite} />
            ) : (
              <img
                className="w-2/4 h-auto select-none pointer-events-none"
                src={opponentActive.frontSprite}
                alt={opponentActive.name}
              />
            )}
          </div>
          <div className="flex justify-end">
            <ActivePokeCount teamCount={selfTeamCount} remainingPokemon={selfRemaining} />
          </div>
        </div>

      </div>


      {/* Bottom Section (Controls + Player Stats) */}
      <div className="sticky bottom-0 flex flex-col z-100">
        <div className=" flex flex-row px-6 pb-6 gap-4">
          {/* Battle Display and Action Panel */}
          <div className="flex w-15/20 justify-center items-baseline-last">
            <BattleDisplayPanel
              mode={mode}
              moves={selfMoves}
              team={selfTeam}
              status={status}
              onMoveSelect={(index) => {
                console.log("Selected move:", index);
                setStatus(`You selected ${selfMoves[index].name}\nWaiting for opponent...`);
                setMode("none");
                socket.emit("submitMove", { action: "attack", index: index });
              }}
              onSwitchSelect={(index) => {
                // console.log("Selected switch with index:", index);
                const selectedName = selfTeam[index].name;
                setStatus(`You switched to ${selectedName}\nWaiting for opponent...`);
                setMode("none");

                if (mode === "fainted") {
                  socket.emit("submitFaintedSwitch", { action: "switch", index: index });
                } else {
                  socket.emit("submitMove", { action: "switch", index: index });
                }
              }}
            />
          </div>

          {/* Action Button Panel */}
          <div className="flex w-1/20 justify-center items-baseline-last">
            <BattleActionsPanel onSelect={setMode} onQuit={handleQuit} />
          </div>

          {/* Player Stats*/}
          <div className="flex w-5/20 justify-bottom items-end">
            <StatsCard
              key={selfActive.name} // re-render
              name={selfActive.name}
              image={selfActive.frontSprite}
              hp={selfActive.hp}
              maxHP={selfActive.maxHP}
            />
          </div>
        
        </div>
      </div>

      {/* Quit Message */}
      {showQuitConfirm && <QuitBattleBox onConfirm={confirmQuit} onCancel={cancelQuit} />}
    
    </div>
  );
}
