import { IFaq, IOthers, OtherType } from "./faq.interface";
import { Faq, Others } from "./faq.model";



const createOrUpdateOthers = async (payload: IOthers) => {
   const isOtherExist = await Others.findOne({ type: payload.type });
   if (isOtherExist) {
      return await Others.findOneAndUpdate({ type: payload.type }, {$set: payload}, { new: true });
   }
   return await Others.create(payload);
};

const getOthers = async(type:OtherType): Promise<IOthers> => {
   const other = await Others.findOne({ type });
   if (!other) {
      throw new Error('Other not found');
   }
   return other;
};

const addQuestionAndAnswer = async (payload: IFaq) => {
   const faq = await Faq.create(payload);
   return faq;
};

const removeQuestionAndAnswer = async (id: string) => {
   const faq = await Faq.findByIdAndDelete(id);
   return faq;
};

const updateQuestionAndAnswer = async (id: string, payload: IFaq) => {
   const faq = await Faq.findByIdAndUpdate(id, payload, { new: true });
   return faq;
};

const getFaq = async(): Promise<IFaq[]> => {
   const faq = await Faq.find();
   if (!faq) {
      throw new Error('Faq not found');
   }
   return faq;
};


export const FaqService = {
   createOrUpdateOthers,
   getOthers,
   addQuestionAndAnswer,
   removeQuestionAndAnswer,
   updateQuestionAndAnswer,
   getFaq
};  