// layoutEngine.js — Multi-floor aware layout engine
import { F } from './helpers.js'
import { vScore, getQuad } from './vastuEngine.js'

export const EW = 0.23

function makeRoom(idRef, name, type, x1, y1, x2, y2, vastuType, extra = {}) {
  const a=F(x1),b=F(y1),c=F(x2),d=F(y2),w=F(c-a),h=F(d-b)
  if (w<0.18||h<0.18) return null
  return { id:idRef.n++, name, type, x1:a,y1:b,x2:c,y2:d, w,h, area:F(w*h),
    vastuType:vastuType||type, isMainDoor:false, inside:false, ...extra }
}

function addBedBath(idRef, name, vt, x1, y1, x2, y2, bathPos) {
  const bw=F(Math.max(1.4,(x2-x1)*0.32)), bh=F(Math.max(1.5,(y2-y1)*0.38))
  let bx1,by1,bx2,by2
  if      (bathPos==='TR'){bx2=x2;bx1=F(x2-bw);by1=y1;by2=F(y1+bh)}
  else if (bathPos==='TL'){bx1=x1;bx2=F(x1+bw);by1=y1;by2=F(y1+bh)}
  else if (bathPos==='BR'){bx2=x2;bx1=F(x2-bw);by2=y2;by1=F(y2-bh)}
  else                    {bx1=x1;bx2=F(x1+bw);by2=y2;by1=F(y2-bh)}
  const bathBox={x1:bx1,y1:by1,x2:bx2,y2:by2}
  const bed  = makeRoom(idRef,name,   'bedroom', x1,y1,x2,y2, vt,       {bathBox})
  const bath = makeRoom(idRef,'Toilet','bathroom',bx1,by1,bx2,by2,'bathroom',{inside:true,parentBed:bed?.id})
  return {bed,bath}
}

// ── Build a single floor's rooms ──────────────────────────────────
function buildFloor(cfg, variant, floorIndex) {
  const v = ((variant||0)%4+4)%4
  const { plotL,plotW,beds,facing,
    hasBalcony,hasGarage,hasPooja,hasStudy,
    hasServant,hasStore,hasStair,hasDining } = cfg

  const iL=F(plotL-2*EW), iW=F(plotW-2*EW), o=EW
  const rooms=[], idRef={n:1+(floorIndex*100)} // offset IDs per floor

  const BED_NAMES=['Master Bed','Bedroom 2','Bedroom 3','Bedroom 4']
  const BED_VT   =['masterBed','bed2','bed3','bed4']
  const numBeds  = Math.min(beds,4)

  function R(name,type,x1,y1,x2,y2,vt,extra){
    const rm=makeRoom(idRef,name,type,x1,y1,x2,y2,vt,extra)
    if(rm)rooms.push(rm); return rm
  }
  function BB(name,vt,x1,y1,x2,y2,pos){
    const {bed,bath}=addBedBath(idRef,name,vt,x1,y1,x2,y2,pos)
    if(bed)rooms.push(bed); if(bath)rooms.push(bath); return{bed,bath}
  }

  // Upper floors: all bedrooms layout (no living/kitchen/dining)
  if (floorIndex > 0) {
    const bedW = F(iL/numBeds)
    // Front half: bedrooms
    const fH=F(iW*0.50), fY1=o, fY2=F(o+fH), bY1=fY2, bY2=F(o+iW)
    for(let i=0;i<numBeds;i++) BB(BED_NAMES[i],BED_VT[i],F(o+i*bedW),fY1,F(o+(i+1)*bedW),fY2,'TR')
    // Back half: extra rooms / open terrace
    const extraW=F(iL*0.35)
    R('Lounge','living',o,bY1,F(o+iL*0.5),bY2)
    R('Open Terrace','balcony',F(o+iL*0.5),bY1,F(o+iL),bY2)
    if(hasStudy) R('Study','study',F(o+iL-extraW),fY1,F(o+iL),F(fY1+fH*0.5))
    // Stair on upper floors
    R('Stair','stair',F(o+iL-1.8),bY1,F(o+iL),F(bY1+Math.min(3.2,(bY2-bY1)*0.7)))
    rooms.forEach(r=>{ r.quad=getQuad(r,plotL,plotW); r.vastu=vScore(r.vastuType,r.quad) })
    return { rooms, plotL, plotW, facing, floorIndex,
      totalArea:F(plotL*plotW), builtUp:F(rooms.filter(r=>!r.inside).reduce((s,r)=>s+r.area,0)),
      variant:v, EW }
  }

  // Ground floor — original logic
  if(v===0){ // SOUTH
    const fH=F(iW*0.40),fY1=o,fY2=F(o+fH),bY1=fY2,bY2=F(o+iW)
    const kitW=F(Math.max(2.4,iL*0.26))
    const dinW=hasDining?F(Math.max(2.0,iL*0.20)):0
    const pooW=hasPooja ?F(Math.max(1.0,iL*0.10)):0
    const livW=F(iL-kitW-dinW-pooW)
    let fx=o
    if(hasPooja){R('Pooja','pooja',fx,fY1,F(fx+pooW),fY2);fx=F(fx+pooW)}
    const lr=R('Living Room','living',fx,fY1,F(fx+livW),fY2)
    if(lr)lr.isMainDoor=true; fx=F(fx+livW)
    if(hasDining){R('Dining','dining',fx,fY1,F(fx+dinW),fY2);fx=F(fx+dinW)}
    R('Kitchen','kitchen',fx,fY1,F(o+iL),fY2)
    const bedW=F(iL/numBeds)
    for(let i=0;i<numBeds;i++) BB(BED_NAMES[i],BED_VT[i],F(o+i*bedW),bY1,F(o+(i+1)*bedW),bY2,'TR')
    if(hasStore)  R('Store',  'store',  F(o+iL-1.4),fY1,F(o+iL),F(fY1+1.8))
    if(hasStudy)  R('Study',  'study',  o,fY1,F(o+Math.min(2.0,livW*.4)),F(fY1+Math.min(1.8,fH*.5)))
    if(hasStair)  R('Stair',  'stair',  F(o+iL-1.8),bY1,F(o+iL),F(bY1+Math.min(3.2,(bY2-bY1)*.7)))
    if(hasServant)R('Servant','servant',F(o+iL-1.8),F(bY1+(bY2-bY1)*.5),F(o+iL),bY2)
    if(hasGarage) R('Garage', 'garage', o,bY2,F(o+Math.min(3.2,iL*.28)),F(bY2+2.4))
    if(hasBalcony)R('Porch',  'balcony',F(o+pooW+livW*.12),F(o-1.1),F(o+pooW+livW*.88),o)
  } else if(v===1){ // NORTH
    const fH=F(iW*0.40),bH=F(iW-fH),fY1=F(o+bH),fY2=F(o+iW),bY1=o,bY2=F(o+bH)
    const kitW=F(Math.max(2.4,iL*0.26))
    const dinW=hasDining?F(Math.max(2.0,iL*0.20)):0
    const pooW=hasPooja ?F(Math.max(1.0,iL*0.10)):0
    const livW=F(iL-kitW-dinW-pooW)
    let fx=F(o+iL)
    R('Kitchen','kitchen',F(fx-kitW),fY1,fx,fY2);fx=F(fx-kitW)
    if(hasDining){R('Dining','dining',F(fx-dinW),fY1,fx,fY2);fx=F(fx-dinW)}
    const lr=R('Living Room','living',F(fx-livW),fY1,fx,fY2)
    if(lr)lr.isMainDoor=true
    if(hasPooja)R('Pooja','pooja',o,fY1,F(o+pooW),fY2)
    const bedW=F(iL/numBeds)
    for(let i=0;i<numBeds;i++) BB(BED_NAMES[i],BED_VT[i],F(o+i*bedW),bY1,F(o+(i+1)*bedW),bY2,'BR')
    if(hasStore)  R('Store',  'store',  F(o+iL-1.4),F(fY2-1.8),F(o+iL),fY2)
    if(hasStair)  R('Stair',  'stair',  F(o+iL-1.8),fY1,F(o+iL),F(fY1+Math.min(3.2,fH*.7)))
    if(hasGarage) R('Garage', 'garage', o,bY2,F(o+Math.min(3.2,iL*.28)),F(bY2+2.4))
    if(hasBalcony)R('Porch',  'balcony',F(o+iL*.12),fY2,F(o+iL*.88),F(fY2+1.1))
  } else if(v===2){ // EAST
    const fW=F(iL*0.36),fX1=F(o+iL-fW),fX2=F(o+iL)
    const kitH=F(Math.max(2.4,iW*0.28))
    const dinH=hasDining?F(Math.max(2.0,iW*0.22)):0
    const pooH=hasPooja ?F(Math.max(1.0,iW*0.10)):0
    const livH=F(iW-kitH-dinH-pooH)
    let fy=o
    if(hasPooja){R('Pooja','pooja',fX1,fy,fX2,F(fy+pooH));fy=F(fy+pooH)}
    const lr=R('Living Room','living',fX1,fy,fX2,F(fy+livH))
    if(lr)lr.isMainDoor=true; fy=F(fy+livH)
    if(hasDining){R('Dining','dining',fX1,fy,fX2,F(fy+dinH));fy=F(fy+dinH)}
    R('Kitchen','kitchen',fX1,fy,fX2,F(o+iW))
    const bedH=F(iW/numBeds)
    for(let i=0;i<numBeds;i++) BB(BED_NAMES[i],BED_VT[i],o,F(o+i*bedH),fX1,F(o+(i+1)*bedH),'TR')
    if(hasStore)  R('Store',  'store',  fX1,F(o+iW-1.8),fX2,F(o+iW))
    if(hasStair)  R('Stair',  'stair',  fX2,o,F(fX2+1.8),F(o+Math.min(3.2,iW*.5)))
    if(hasGarage) R('Garage', 'garage', fX2,F(o+iW*.5),F(fX2+2.8),F(o+iW))
    if(hasBalcony)R('Porch',  'balcony',fX2,F(o+pooH+livH*.12),F(fX2+1.1),F(o+pooH+livH*.88))
  } else { // WEST
    const fW=F(iL*0.36),fX1=o,fX2=F(o+fW)
    const kitH=F(Math.max(2.4,iW*0.28))
    const dinH=hasDining?F(Math.max(2.0,iW*0.22)):0
    const pooH=hasPooja ?F(Math.max(1.0,iW*0.10)):0
    const livH=F(iW-kitH-dinH-pooH)
    let fy=o
    if(hasPooja){R('Pooja','pooja',fX1,fy,fX2,F(fy+pooH));fy=F(fy+pooH)}
    const lr=R('Living Room','living',fX1,fy,fX2,F(fy+livH))
    if(lr)lr.isMainDoor=true; fy=F(fy+livH)
    if(hasDining){R('Dining','dining',fX1,fy,fX2,F(fy+dinH));fy=F(fy+dinH)}
    R('Kitchen','kitchen',fX1,fy,fX2,F(o+iW))
    const bedH=F(iW/numBeds)
    for(let i=0;i<numBeds;i++) BB(BED_NAMES[i],BED_VT[i],fX2,F(o+i*bedH),F(o+iL),F(o+(i+1)*bedH),'TL')
    if(hasStore)  R('Store',  'store',  fX1,F(o+iW-1.8),fX2,F(o+iW))
    if(hasStair)  R('Stair',  'stair',  F(o-1.8),o,o,F(o+Math.min(3.2,iW*.5)))
    if(hasGarage) R('Garage', 'garage', F(o-2.8),F(o+iW*.5),o,F(o+iW))
    if(hasBalcony)R('Porch',  'balcony',F(fX1-1.1),F(o+pooH+livH*.12),fX1,F(o+pooH+livH*.88))
  }

  rooms.forEach(r=>{ r.quad=getQuad(r,plotL,plotW); r.vastu=vScore(r.vastuType,r.quad) })
  return { rooms, plotL, plotW, facing, floorIndex,
    totalArea:F(plotL*plotW),
    builtUp:F(rooms.filter(r=>!r.inside).reduce((s,r)=>s+r.area,0)),
    variant:v, EW }
}

// ── Main export: builds all floors ────────────────────────────────
export function buildLayout(cfg, variant) {
  const numFloors = cfg.floors==='G+2' ? 3 : cfg.floors==='G+1' ? 2 : 1
  const floors = []
  for (let i=0; i<numFloors; i++) floors.push(buildFloor(cfg, variant, i))

  const gf = floors[0]
  return {
    // Backward-compat: expose ground floor rooms at top level
    rooms:      gf.rooms,
    plotL:      gf.plotL,
    plotW:      gf.plotW,
    facing:     gf.facing,
    totalArea:  gf.totalArea,
    builtUp:    floors.reduce((s,f)=>s+f.builtUp,0),
    variant:    gf.variant,
    EW,
    // Multi-floor data
    floors,
    numFloors,
  }
}