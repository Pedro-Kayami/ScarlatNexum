import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { stage0 } from '@/assets/bots/coopmetro/stage/0'
import { stage1 } from '@/assets/bots/coopmetro/stage/1'
import { stage2 } from '@/assets/bots/coopmetro/stage/2'
import { stage3 } from '@/assets/bots/coopmetro/stage/3'
import { stage4 } from '@/assets/bots/coopmetro/stage/4'
import { stage5 } from '@/assets/bots/coopmetro/stage/5'
import { stage6 } from '@/assets/bots/coopmetro/stage/6'
import { stage7 } from '@/assets/bots/coopmetro/stage/7_mercadolivre'
import { stage8 } from '@/assets/bots/coopmetro/stage/8_mercadolivre'
import { stage9 } from '@/assets/bots/coopmetro/stage/9_operacoes'
import { stage10 } from '@/assets/bots/coopmetro/stage/10_operacoes'
import { stage11 } from '@/assets/bots/coopmetro/stage/11'
import { stage12 } from '@/assets/bots/coopmetro/stage/12'
import { stage13 } from '@/assets/bots/coopmetro/stage/13'

export async function stagesCoopmetro(
  message: MessageResponse,
  stageNumber: number,
) {
  switch (stageNumber) {
    case 0:
      return await stage0(message)
    case 1:
      return await stage1(message)
    case 2:
      return await stage2(message)
    case 3:
      return await stage3(message)
    case 4:
      return await stage4(message)
    case 5:
      return await stage5(message)
    case 6:
      return await stage6(message)
    case 7:
      return await stage7(message)
    case 8:
      return await stage8(message)
    case 9:
      return await stage9(message)
    case 10:
      return await stage10(message)
    case 11:
      return await stage11(message)
    case 12:
      return await stage12(message)
    case 13:
      return await stage13(message)
    default:
      console.error('Invalid stage number:', stageNumber)
  }
}
